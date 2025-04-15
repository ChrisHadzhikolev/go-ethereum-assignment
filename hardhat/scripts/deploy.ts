import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", await deployer.getAddress());


  const Lock = await ethers.getContractFactory("Lock");
  const unlockTime = Math.floor(Date.now() / 1000) + 60; 
  const contract = await Lock.deploy(unlockTime, { value: ethers.parseEther("0.1") });


  console.log("Contract deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
