import { expect } from "chai";
import hre from "hardhat";

describe("Lock", function () {
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const ONE_GWEI = hre.ethers.parseUnits("1", "gwei");

  let owner: any;
  let otherAccount: any;
  let Lock: any;
  let lock: any;
  let unlockTime: number;
  let lockedAmount: bigint;

  beforeEach(async function () {
    [owner, otherAccount] = await hre.ethers.getSigners();
    Lock = await hre.ethers.getContractFactory("Lock");

    const blockNum = await hre.ethers.provider.getBlockNumber();
    const block = await hre.ethers.provider.getBlock(blockNum);
    const currentTime = block!.timestamp;

    unlockTime = currentTime + ONE_YEAR_IN_SECS;
    lockedAmount = ONE_GWEI;

    lock = await Lock.deploy(unlockTime, { value: lockedAmount });
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
      const balance = await hre.ethers.provider.getBalance(lock.target);
      expect(balance).to.equal(lockedAmount);
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      const blockNum = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNum);
      const currentTime = block!.timestamp;

      await expect(Lock.deploy(currentTime, { value: ONE_GWEI }))
        .to.be.revertedWith("Unlock time should be in the future");
    });
  });
});
