import SearchBox from '/src/components/SearchBox'
import { BCName } from '/src/types/BCName'
import { SearchResult } from '/src/types/SearchResult'
import { Container, Text, VStack } from '@chakra-ui/react'
import { ethers } from 'ethers'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import GetNameCard from '../../src/components/GetNameCard'
import SearchResultCard from '../../src/components/SearchResultCard'
import { zeroAddress } from '../../src/utils/address_utils'
import { AccountNotLinkedError, BCNameError } from '../../src/utils/errors'

const Search: NextPage = () => {
  const { terms } = useRouter().query
  const [, setAddresses] = useState<string[]>()
  // const [addresses, setAddresses] = useState<string[]>()
  const [selectedAddress, setSelectedAddress] = useState<string>()
  const [contract, setContract] = useState<BCName>()
  const [searchResult, setSearchResult] = useState<SearchResult>()
  const [error, setError] = useState<BCNameError>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {
      try {
        let accounts = await window.ethereum?.request({
          method: 'eth_accounts',
        })
        if (!accounts?.length) {
          accounts = await window.ethereum?.request({
            method: 'eth_requestAccounts',
          })
        }
        console.log('accounts:', accounts)
        setAddresses(accounts ?? [])
        if (accounts && accounts.length >= 1) {
          setSelectedAddress(accounts[0])
        }
      } catch (e) {
        setLoading(false)
        setError(AccountNotLinkedError)
      }
    })()
  }, [])

  useEffect(() => {
    window.ethereum?.on('accountsChanged', (accounts: string[]) => {
      setAddresses(accounts)
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
    if (!process.env.NEXT_PUBLIC_CONTRACT_ABI) {
      console.error('Contract ABI is unset')
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(selectedAddress)
    setContract(
      new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        process.env.NEXT_PUBLIC_CONTRACT_ABI,
        signer
      ) as BCName
    )
    console.log('contract address:', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    console.log('contract ABI:', process.env.NEXT_PUBLIC_CONTRACT_ABI)
  }, [selectedAddress])

  useEffect(() => {
    if (!contract || !terms) {
      return
    }

    // eslint-disable-next-line prettier/prettier
    (async () => {
      const ownedNames = []
      const allNamesEver = []
      const term = (terms as string).trim()
      const address: string | undefined = ethers.utils.isAddress(term)
        ? term
        : await contract?.getOwner(term)
      console.log('address:', address)
      if (!address) {
        console.log('returns due to address:', address)
        return
      }

      console.log('continues due to address:', address)
      const allNames = await contract?.getAllNamesEver(address)
      for (const name of allNames ?? []) {
        allNamesEver.push(name)
        const nameOwner = await contract?.getOwner(name)
        if (nameOwner !== address) {
          continue
        }
        ownedNames.push(name)
      }

      const result = {
        address,
        allNamesEver,
        ownedNames,
      }
      setSearchResult(result)
      setLoading(false)
      console.log(result)
    })()
  }, [contract, terms])

  return (
    <Container maxWidth={600} padding={0}>
      <VStack height={'100vh'} paddingY={20}>
        <SearchBox
          onSearchButtonClicked={() => Promise.resolve()}
          size={'lg'}
          placeholder={'Search names or addresses'}
        />
        {searchResult && searchResult?.address !== zeroAddress ? (
          <SearchResultCard
            searchResult={searchResult}
            selectedAddress={selectedAddress}
          />
        ) : searchResult ? (
          <GetNameCard
            name={terms as string}
            price={0}
            linkName={() => Promise.resolve()}
          />
        ) : error ? (
          <Text>{error.message}</Text>
        ) : loading ? (
          <Text>Loading search results</Text>
        ) : (
          <Text>An error occurred</Text>
        )}
      </VStack>
    </Container>
  )
}

export default Search
