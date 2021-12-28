import { ethers, run, upgrades } from 'hardhat'

async function main() {
  await run('compile')

  if (!process.env.CONTRACT_ADDRESS) {
    throw Error('Proxy contract address must be set to upgrade implementations')
  }

  // We get the contract to deploy
  const implementationFactory = await ethers.getContractFactory('BCName')
  const contract = await upgrades.upgradeProxy(
    process.env.CONTRACT_ADDRESS,
    implementationFactory
  )

  await contract.deployed()

  console.log('Proxy deployed to:', contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
