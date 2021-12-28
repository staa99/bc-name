import { ethers, run, upgrades } from 'hardhat'

async function main() {
  await run('compile')

  // We get the contract to deploy
  const implementationFactory = await ethers.getContractFactory('BCName')
  const contract = await upgrades.deployProxy(implementationFactory, {
    initializer: 'initialize',
  })

  await contract.deployed()

  console.log('Proxy deployed to:', contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
