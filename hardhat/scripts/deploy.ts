import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", await deployer.getAddress());


  const MyContract = await ethers.getContractFactory("MyContract");
  const contract = await MyContract.deploy();

  console.log("Contract deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
