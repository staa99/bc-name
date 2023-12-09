import { Container, Text, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import SearchBox from '../src/components/SearchBox'
import { requestOrLoadAccounts } from '../src/web3/accountUtils'
import { useBCNameContract } from '../src/web3/BCNameContractContext'

const Home: NextPage = () => {
  const router = useRouter()
  const { contract, setSelectedAddress } = useBCNameContract()

  const onSearch = async (
    terms: string,
    setErrorMessage: (err: string) => void,
  ) => {
    if (!contract) {
      const accounts = await requestOrLoadAccounts()
      if (!accounts?.length) {
        setErrorMessage('Connect MetaMask to this site to continue')
      }
      setSelectedAddress(accounts[0])
    }
    await router.push(`search/${terms}`)
  }

  return (
    <Container maxWidth={600} padding={0}>
      <VStack height={'100vh'} paddingY={20} justifyContent={'center'}>
        <Text fontSize={'xxx-large'}>BC Name</Text>
        <SearchBox
          onSearchButtonClicked={onSearch}
          size={'lg'}
          placeholder={'Search names or addresses'}
          helperText={'Get your BC name or find record data'}
        />
      </VStack>
    </Container>
  )
}

export default Home
