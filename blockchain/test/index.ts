import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BCName } from '../typechain'

describe('BCName', function () {
  const initContract = async (): Promise<BCName> => {
    const contractFactory = await ethers.getContractFactory('BCName')
    const contract = (await contractFactory.deploy()) as unknown as BCName
    await contract.deployed()
    const tx = await contract.initialize()
    await tx.wait()
    console.log('Test contract deployed to:', (contract as any).address)
    return contract
  }

  const initContractForRandomUser = async (): Promise<BCName> => {
    const [, nonOwner] = await ethers.getSigners()
    const contract = await initContract()
    return contract.connect(nonOwner)
  }

  describe('register', () => {
    it('Should return as owner when registered', async () => {
      // arrange
      const bcName = 'test'
      const [, nonOwner] = await ethers.getSigners()
      const contract = await initContractForRandomUser()

      // act
      const tx = await contract.register(bcName)
      await tx.wait()

      // assert
      expect(await contract.getOwner(bcName)).to.equal(nonOwner.address)
    })

    it('Should always succeed when already registered', async () => {
      // arrange
      const bcName = 'test1'
      const [, nonOwner] = await ethers.getSigners()
      const contract = await initContractForRandomUser()
      let tx = await contract.register(bcName)
      await tx.wait()

      // act
      tx = await contract.register(bcName)
      await tx.wait()

      // assert
      expect(await contract.getOwner(bcName)).to.equal(nonOwner.address)
    })

    it('Should fail when name is already mapped to a different address', async () => {
      // arrange
      const bcName = 'test1'
      const [, , nonOwner2] = await ethers.getSigners()
      const contract = await initContractForRandomUser()
      const tx = await contract.register(bcName)
      await tx.wait()
      const contractInNewContext = contract.connect(nonOwner2)
      let error: Error | null = null

      // act
      try {
        await contractInNewContext.register(bcName)
      } catch (e: any) {
        error = e
        console.error(e)
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })

    it('Should fail when insufficient value is sent', async () => {
      // arrange
      const bcName = 'test1'
      const bcName2 = 'test2'
      const contract = await initContractForRandomUser()
      const tx = await contract.register(bcName)
      await tx.wait()
      let error: Error | null = null

      // act
      try {
        await contract.register(bcName2)
      } catch (e: any) {
        error = e
        console.error(e)
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })

    it('Should succeed when sufficient value is sent', async () => {
      // arrange
      const bcName = 'test1'
      const bcName2 = 'test2'
      const [, nonOwner] = await ethers.getSigners()
      const contract = await initContractForRandomUser()
      const tx = await contract.register(bcName)
      await tx.wait()

      // act
      try {
        await contract.register(bcName2, {
          value: ethers.utils.parseEther('0.0001'),
        })
      } catch (e) {
        console.error(e)
        console.error(JSON.stringify(e))
      }

      // assert
      expect(await contract.getOwner(bcName)).to.equal(nonOwner.address)
      expect(await contract.getOwner(bcName2)).to.equal(nonOwner.address)
    })

    it('Should add names to list of ever linked names', async () => {
      // arrange
      const bcName = 'test1'
      const bcName2 = 'test2'
      const [, nonOwner] = await ethers.getSigners()
      const contract = await initContractForRandomUser()
      const tx = await contract.register(bcName)
      await tx.wait()

      // act
      try {
        await contract.register(bcName2, {
          value: ethers.utils.parseEther('0.0001'),
        })
      } catch (e) {
        console.error(e)
        console.error(JSON.stringify(e))
      }

      // assert
      const allNamesEver = await contract.getAllNamesEver(nonOwner.address)
      expect(allNamesEver.length).to.equal(2)
      expect(allNamesEver[0]).to.equal(bcName)
      expect(allNamesEver[1]).to.equal(bcName2)
    })
  })
})
