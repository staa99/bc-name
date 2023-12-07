import { ethers, network, run, upgrades } from 'hardhat'

async function main() {
  await run('compile')

  const priceUnitEtherKey = `${network.name.toUpperCase()}_NETWORK_PRICE_UNIT_ETHER`
  const priceUnitEther = process.env[priceUnitEtherKey]

  if (!priceUnitEther) {
    throw Error(`Price unit not configured for ${network.name}`)
  }
  const priceUnits = ethers.utils.parseEther(priceUnitEther)

  // We get the contract to deploy
  const implementationFactory = await ethers.getContractFactory('BCName')
  const contract = await upgrades.deployProxy(
    implementationFactory,
    [priceUnits],
    {
      initializer: 'initialize',
      verifySourceCode: true,
    }
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
