import { ethers } from 'ethers'
import React, { useContext, useEffect, useState } from 'react'
import { BCName } from '../types/BCName'
import BCNameContract from './BCNameContract'
import bcNameABI from './bc-name-abi.json'

interface BCNameContractContextData {
  selectedAddress: string | undefined
  contract: BCNameContract | undefined
  setSelectedAddress(address: string): void
  setContract(contract: BCNameContract): void
}

const defaultContextData: BCNameContractContextData = {
  contract: undefined,
  selectedAddress: undefined,
  setSelectedAddress: () => {
    // intentionally empty
  },
  setContract: () => {
    // intentionally empty
  },
}

const localStorageSelectedAddressKey = 'seladdr'

const BCNameContractContext =
  React.createContext<BCNameContractContextData>(defaultContextData)

export const BCNameProvider = ({
  children,
}: React.PropsWithChildren<Record<string, unknown>>) => {
  const [contract, setContract] = useState<BCNameContract>()
  const [selectedAddress, doSetSelectedAddress] = useState<string>()

  const setSelectedAddress = (address: string) => {
    localStorage.setItem(localStorageSelectedAddressKey, address)
    doSetSelectedAddress(address)
  }

  const contextData = {
    contract,
    setContract,
    selectedAddress,
    setSelectedAddress,
  }

  useEffect(() => {
    if (selectedAddress) {
      return
    }

    const address = localStorage.getItem(localStorageSelectedAddressKey)
    if (address) {
      doSetSelectedAddress(address)
    }
  }, [selectedAddress])

  useEffect(() => {
    window.ethereum?.on('accountsChanged', (accounts: string[]) => {
      setSelectedAddress(accounts[0])
    })
  }, [])

  useEffect(() => {
    if (!selectedAddress) {
      return
    }

    if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      console.error('Contract address is unset')
      return
    }
    if (!bcNameABI?.length) {
      console.error('Contract ABI is unset')
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(selectedAddress)
    setContract(
      new BCNameContract(
        new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          bcNameABI,
          signer,
        ) as BCName,
      ),
    )
    console.log('contract address:', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    console.log('contract ABI:', process.env.NEXT_PUBLIC_CONTRACT_ABI)
  }, [selectedAddress])

  return (
    <BCNameContractContext.Provider value={contextData}>
      {children}
    </BCNameContractContext.Provider>
  )
}

export const useBCNameContract = () => useContext(BCNameContractContext)
