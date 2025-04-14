import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    geth: {
      url: "http://localhost:8551",
      // `personal_unlockAccount`?
      // devkey?
      // accounts: ["0x..."]?
    },
  },
};

export default config;
