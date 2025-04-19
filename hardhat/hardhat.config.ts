import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
   solidity: {
    version: "0.8.28",
  },
  networks: {
    devnet: {
      url: "http://localhost:8545",
      chainId: 1337,
    },
  },
};

export default config;
