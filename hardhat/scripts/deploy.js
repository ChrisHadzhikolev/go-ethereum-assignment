const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const unlockTime = Math.floor(Date.now() / 1000) + 3600; 
  const lockedAmount = hre.ethers.utils.parseEther("0.1"); 

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();

  console.log(`Lock deployed to: ${lock.address}`);
  console.log(`Unlock time: ${unlockTime}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
