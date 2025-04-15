import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
   solidity: {
    version: "0.8.28",
  },
  networks: {
    geth: {
      url: "http://localhost:8545",
      // `personal_unlockAccount`?
      // devkey?
      // accounts: ["0x..."]?
    },
  },
};

export default config;
