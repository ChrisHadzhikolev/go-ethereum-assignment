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
      accounts: ['4f3edf983ac636a65a842ce7c78d9aa706d3b113b37c936e9c37fda7f1f7c8c2'],
    },
  },
};

export default config;
