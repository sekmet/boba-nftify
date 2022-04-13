require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")

const BOBA_PRIVATE_KEY = process.env.BOBA_PRIVATE_KEY || ""
const INFURA_API_KEY = process.env.INFURA_API_KEY || ""
const REPORT_GAS = process.env.REPORT_GAS || false

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
      compilers: [{ version: "0.8.7",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      } 
    }],
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  networks: {
    hardhat: {
        initialBaseFeePerGas: 0, //https://github.com/sc-forks/solidity-coverage/issues/652
    },
    localhost: {},
    bobaRinkeby: {
      url: `https://rinkeby.boba.network/`,
      accounts: [BOBA_PRIVATE_KEY],
      saveDeployments: true,
    },
    coverage: {
      url: "http://127.0.0.1:8555", // Coverage launches its own ganache-cli client
  },
}
}
