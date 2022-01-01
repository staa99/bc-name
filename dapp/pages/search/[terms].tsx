import SearchBox from '../../src/components/SearchBox'
import { SearchResult } from '../../src/types/SearchResult'
import { Container, Text, VStack } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import GetNameCard from '../../src/components/GetNameCard'
import SearchResultCard from '../../src/components/SearchResultCard'
import { zeroAddress } from '../../src/utils/address_utils'
import { useBCNameContract } from '../../src/web3/BCNameContractContext'

const Search: NextPage = () => {
  const router = useRouter()
  const terms = router.query.terms as string
  const [searchResult, setSearchResult] = useState<SearchResult>()
  const [loading, setLoading] = useState(true)
  const { contract, selectedAddress } = useBCNameContract()
  const [price, setPrice] = useState(BigNumber.from(0))

  const onSearchClicked = async (newTerms: string) => {
    await router.push(newTerms.trim(), undefined, { shallow: true })
  }

  useEffect(() => {
    if (!contract || !terms) {
      return
    }

    // eslint-disable-next-line prettier/prettier
    (async () => {
      setSearchResult(await contract.searchNamesOrAddresses(terms))
      setLoading(false)
    })()
  }, [contract, terms])

  useEffect(() => {
    if (!contract || !terms) {
      return
    }

    if (searchResult?.address === zeroAddress) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      const price = await contract.getLinkingPrice(terms)
      if (price) {
        setPrice(price)
      }
    })()
  }, [contract, terms, searchResult])

  const goToConfirmRegistration = async () => {
    await router.push(`/confirm-registration/${terms}`)
  }

  return (
    <Container maxWidth={600} padding={0}>
      <VStack height={'100vh'} paddingY={20}>
        <SearchBox
          onSearchButtonClicked={onSearchClicked}
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
            name={terms}
            price={price}
            linkName={goToConfirmRegistration}
          />
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
