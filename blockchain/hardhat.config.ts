import * as dotenv from 'dotenv'

import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@openzeppelin/hardhat-upgrades'
import {utils} from 'ethers'

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const accounts =
  process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || '',
      accounts: accounts,
    },
    bsc_testnet: {
      url: process.env.BSC_TESTNET_URL || '',
      chainId: 97,
      accounts: accounts,
    },
    bsc_mainnet: {
      url: process.env.BSC_MAINNET_URL || '',
      chainId: 56,
      accounts: accounts,
      timeout: 1000000,
    },
    linea_testnet: {
      url: process.env.LINEA_TESTNET_URL || '',
      chainId: 59140,
      accounts: accounts,
      gasPrice: utils.parseUnits('2', 'gwei').toNumber(),
      loggingEnabled: true,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 0,
  },
}

export default config
