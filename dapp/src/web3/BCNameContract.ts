import { BigNumber, ethers } from 'ethers'
import { BCName } from '../types/BCName'
import { SearchResult } from '../types/SearchResult'

export default class BCNameContract {
  contract: BCName

  constructor(contract: BCName) {
    if (!contract) {
      throw Error('Null reference while initializing contract API')
    }

    this.contract = contract
  }

  normalize(name: string) {
    return name.toLowerCase()
  }

  async searchNamesOrAddresses(
    nameOrAddress: string
  ): Promise<SearchResult | undefined> {
    const ownedNames = []
    const allNamesEver = []
    const address: string | undefined = ethers.utils.isAddress(nameOrAddress)
      ? nameOrAddress
      : await this.contract.getOwner(this.normalize(nameOrAddress))

    if (!address) {
      console.log('Failed to load address')
      return undefined
    }

    console.log('continues due to address:', address)
    const allNames = await this.contract.getAllNamesEver(address)
    for (const name of allNames ?? []) {
      allNamesEver.push(name)
      const nameOwner = await this.contract.getOwner(this.normalize(name))
      if (nameOwner !== address) {
        continue
      }
      ownedNames.push(name)
    }

    return {
      address,
      allNamesEver,
      ownedNames,
    }
  }

  async getLinkingPrice(name: string): Promise<BigNumber | undefined> {
    try {
      return this.contract.getLinkingPrice(this.normalize(name))
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  async registerName(name: string): Promise<boolean> {
    try {
      const tx = await this.contract.register(name, {
        value: await this.contract.getLinkingPrice(name),
      })
      await tx.wait()
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
