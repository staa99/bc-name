import { Container, Text, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import SearchBox from '../src/components/SearchBox'

const Home: NextPage = () => {
  const router = useRouter()
  const onSearch = async (terms: string) => {
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
