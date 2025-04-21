import { expect } from "chai";
import { ethers } from "hardhat";
import { Lock } from "../typechain-types";

describe("Lock (Geth-Compatible)", function () {
  const ONE_GWEI = ethers.parseUnits("1", "gwei");
  const WAIT_SECONDS = 5; // Change to 60 in production if needed

  let lock: Lock;
  let owner: any;
  let otherAccount: any;
  let unlockTime: number;
  const lockedAmount = ONE_GWEI;

  beforeEach(async () => {
    [owner, otherAccount] = await ethers.getSigners();
    const LockFactory = await ethers.getContractFactory("Lock");

    const block = await ethers.provider.getBlock("latest");
    unlockTime = block!.timestamp + WAIT_SECONDS;

    lock = (await LockFactory.deploy(unlockTime, { value: lockedAmount })) as Lock;
    await lock.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const balance = await ethers.provider.getBalance(lock.getAddress());
      expect(balance).to.equal(lockedAmount);
    });

    it("Should fail if unlockTime is not in the future", async function () {
      const now = (await ethers.provider.getBlock("latest"))!.timestamp;
      const LockFactory = await ethers.getContractFactory("Lock");
      await expect(LockFactory.deploy(now, { value: ONE_GWEI })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  describe("Withdrawals", function () {
    it("Should revert if called too soon", async function () {
      await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
    });

    it("Should revert if called by someone else after unlock time", async function () {
      console.log(`⏳ Waiting ${WAIT_SECONDS} seconds...`);
      await new Promise((res) => setTimeout(res, WAIT_SECONDS * 1000));
      await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith("You aren't the owner");
    });

    it("Should allow owner to withdraw after unlock time", async function () {
      console.log(`⏳ Waiting ${WAIT_SECONDS} seconds...`);
      await new Promise((res) => setTimeout(res, WAIT_SECONDS * 1000));

      const ownerBefore = await ethers.provider.getBalance(owner.address);

      const tx = await lock.withdraw();
      const receipt = await tx.wait();
      const gasCost = receipt!.gasUsed * tx.gasPrice!;

      const ownerAfter = await ethers.provider.getBalance(owner.address);
      const balanceDiff = ownerAfter - ownerBefore + gasCost;

      expect(balanceDiff).to.equal(lockedAmount);
    });

    it("Should emit a Withdrawal event", async function () {
      console.log(`⏳ Waiting ${WAIT_SECONDS} seconds...`);
      await new Promise((res) => setTimeout(res, WAIT_SECONDS * 1000));

      await expect(lock.withdraw()).to.emit(lock, "Withdrawal");
    });
  });
});
