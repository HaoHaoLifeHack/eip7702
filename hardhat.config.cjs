require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.USER1_PRIVATE_KEY, process.env.USER2_PRIVATE_KEY]
    },
    holesky: {
      url: process.env.HOLESKY_RPC_URL,
      accounts: [process.env.USER1_PRIVATE_KEY, process.env.USER2_PRIVATE_KEY]
    },
    hardhat: {
      hardfork: "prague",
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      hardfork: "prague"
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
