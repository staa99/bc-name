import { Container, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import SearchBox from '/src/components/searchbox'
import { useEffect } from 'react'

const Search: NextPage = () => {
  const router = useRouter()
  const { terms } = router.query

  useEffect(() => {
    console.log(terms)
  })

  return (
    <Container maxWidth={600} padding={0}>
      <VStack height={'100vh'} paddingY={20}>
        <SearchBox
          onSearchButtonClicked={() => Promise.resolve()}
          size={'lg'}
          placeholder={'Search names or addresses'}
        />
      </VStack>
    </Container>
  )
}

export default Search
