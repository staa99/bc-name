import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BCName } from '../typechain'

const zeroAddress = '0x0000000000000000000000000000000000000000'

const initContract = async (): Promise<BCName> => {
  const contractFactory = await ethers.getContractFactory('BCName')
  const contract = (await contractFactory.deploy()) as unknown as BCName
  await contract.deployed()
  const tx = await contract.initialize()
  await tx.wait()
  return contract
}

describe('BCName', () => {
  let bcName1: string,
    bcName2: string,
    owner: SignerWithAddress,
    signer1: SignerWithAddress,
    signer2: SignerWithAddress,
    signer3: SignerWithAddress,
    contract: BCName

  before(async () => {
    bcName1 = 'test1'
    bcName2 = 'test2'
    ;[owner, signer1, signer2, signer3] = await ethers.getSigners()
  })

  describe('register', () => {
    beforeEach(async () => {
      contract = (await initContract()).connect(signer1)
    })

    it('Should set owner when registered', async () => {
      // arrange

      // act
      const tx = await contract.register(bcName1)
      await tx.wait()

      // assert
      const allNamesEver = await contract.getAllNamesEver(signer1.address)
      expect(await contract.getOwner(bcName1)).to.equal(signer1.address)
      expect(allNamesEver.length).to.equal(1)
      expect(allNamesEver[0]).to.equal(bcName1)
    })

    it('Should always succeed when same name is already registered to the same user', async () => {
      // arrange
      let tx = await contract.register(bcName1)
      await tx.wait()

      // act
      tx = await contract.register(bcName1)
      await tx.wait()

      // assert
      expect(await contract.getOwner(bcName1)).to.equal(signer1.address)
    })

    it('Should fail when name is already mapped to a different address', async () => {
      // arrange
      const tx = await contract.register(bcName1)
      await tx.wait()
      const contractInNewContext = contract.connect(signer2)
      let error: Error | null = null

      // act
      try {
        await contractInNewContext.register(bcName1)
      } catch (e: any) {
        error = e
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })

    it('Should fail when insufficient value is sent', async () => {
      // arrange
      const tx = await contract.register(bcName1)
      await tx.wait()
      let error: Error | null = null

      // act
      try {
        await contract.register(bcName2)
      } catch (e: any) {
        error = e
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })

    it('Should succeed when sufficient value is sent', async () => {
      // arrange
      const tx = await contract.register(bcName1)
      await tx.wait()

      // act
      try {
        await contract.register(bcName2, {
          value: await contract.getLinkingPrice(bcName2),
        })
      } catch (e) {
        console.error(JSON.stringify(e))
      }

      // assert
      const allNamesEver = await contract.getAllNamesEver(signer1.address)
      expect(await contract.getOwner(bcName1)).to.equal(signer1.address)
      expect(await contract.getOwner(bcName2)).to.equal(signer1.address)
      expect(allNamesEver.length).to.equal(2)
      expect(allNamesEver[0]).to.equal(bcName1)
      expect(allNamesEver[1]).to.equal(bcName2)
    })
  })

  describe('release', () => {
    beforeEach(async () => {
      contract = (await initContract()).connect(signer1)
    })

    it('Should succeed when releasing an owned name', async () => {
      // arrange
      let tx = await contract.register(bcName1)
      await tx.wait()

      // act
      tx = await contract.release(bcName1)
      await tx.wait()

      // assert
      expect(await contract.getOwner(bcName1)).to.equal(zeroAddress)
      expect(await contract.getTransferOwner(bcName1)).to.equal(zeroAddress)
    })

    it('Should fail when trying to release unowned name', async () => {
      // arrange
      const tx = await contract.register(bcName1)
      await tx.wait()
      const contractInNewContext = contract.connect(signer2)
      let error: Error | null = null

      // act
      try {
        await contractInNewContext.release(bcName1)
      } catch (e: any) {
        error = e
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })

    it('Should fail when trying to release an owned name twice', async () => {
      // arrange
      let tx = await contract.register(bcName1)
      await tx.wait()
      let error: Error | null = null

      // act
      try {
        tx = await contract.release(bcName1)
        await tx.wait()
        await contract.release(bcName1)
      } catch (e: any) {
        error = e
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })
  })

  describe('transfer', () => {
    beforeEach(async () => {
      contract = (await initContract()).connect(signer1)
    })

    it('Should succeed when transferring to another address with correct value', async () => {
      // arrange
      let tx = await contract.register(bcName1)
      await tx.wait()

      // act
      tx = await contract.transfer(bcName1, signer2.address, {
        value: await contract.getTransferPrice(bcName1),
      })
      await tx.wait()

      // assert
      // still owned by signer original owner until claimed
      expect(await contract.getOwner(bcName1)).to.equal(signer1.address)

      // available to new owner for claiming
      expect(await contract.getTransferOwner(bcName1)).to.equal(signer2.address)
    })

    it('Should fail when trying to transfer unowned name', async () => {
      // arrange
      const tx = await contract.register(bcName1)
      await tx.wait()
      const contractInNewContext = contract.connect(signer2)
      let error: Error | null = null

      // act
      try {
        await contractInNewContext.transfer(bcName1, signer1.address)
      } catch (e: any) {
        error = e
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })

    it('Should fail when trying to transfer to same address', async () => {
      // arrange
      const tx = await contract.register(bcName1)
      await tx.wait()
      let error: Error | null = null

      // act
      try {
        await contract.transfer(bcName1, signer1.address)
      } catch (e: any) {
        error = e
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })

    it('Should fail when trying to transfer without sufficient value', async () => {
      // arrange
      const tx = await contract.register(bcName1)
      await tx.wait()
      let error: Error | null = null

      // act
      try {
        await contract.transfer(bcName1, signer2.address)
      } catch (e: any) {
        error = e
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })
  })

  describe('claim', () => {
    beforeEach(async () => {
      contract = (await initContract()).connect(signer1)
    })

    it('Should succeed when claiming a valid transfer', async () => {
      // arrange
      let tx = await contract.register(bcName1)
      await tx.wait()
      tx = await contract.transfer(bcName1, signer2.address, {
        value: await contract.getTransferPrice(bcName1),
      })
      await tx.wait()
      const contractAsSigner2 = contract.connect(signer2)

      // act
      tx = await contractAsSigner2.claim(bcName1)
      await tx.wait()

      // assert
      // now owned by claimer
      expect(await contract.getOwner(bcName1)).to.equal(signer2.address)

      // unavailable for claiming
      expect(await contract.getTransferOwner(bcName1)).to.equal(zeroAddress)
    })

    it('Should fail when trying to claim unowned transfer', async () => {
      // arrange
      let tx = await contract.register(bcName1)
      await tx.wait()
      tx = await contract.transfer(bcName1, signer2.address, {
        value: await contract.getTransferPrice(bcName1),
      })
      await tx.wait()
      const contractAsSigner3 = contract.connect(signer3)
      let error: Error | null = null

      // act
      try {
        await contractAsSigner3.claim(bcName1)
      } catch (e: any) {
        error = e
        console.error(JSON.stringify(e))
      }

      // assert
      expect(error).to.not.be.null
    })
  })
})
