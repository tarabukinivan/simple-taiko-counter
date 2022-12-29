import * as dotenv from 'dotenv'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"

dotenv.config()

const { ACCOUNT_PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    taikoa1: {
      url: "https://l2rpc.a1.taiko.xyz",
      chainId: 167003,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
  },
};

export default config;
