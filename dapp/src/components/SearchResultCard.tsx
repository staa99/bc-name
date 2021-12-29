import {
  Badge,
  Button,
  Center,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { SearchResult } from '../types/SearchResult'

interface SearchResultCardProps {
  searchResult: SearchResult
  selectedAddress?: string
}

const SearchResultCard = ({
  searchResult,
  selectedAddress,
}: SearchResultCardProps) => {
  const colorMode = useColorModeValue('gray.50', 'gray.800')
  return (
    <Center py={6}>
      <VStack justifyContent="center" alignItems="center" p={1} pt={2}>
        <Heading fontSize={'md'} fontFamily={'body'}>
          {searchResult.address}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
          {searchResult.address !== selectedAddress
            ? 'All names owned'
            : 'Your linked names'}
        </Text>

        <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
          {searchResult.ownedNames?.map((n) => (
            <Badge px={2} py={1} bg={colorMode} fontWeight={'400'} key={n}>
              {n}
            </Badge>
          ))}
        </Stack>

        {searchResult.address === selectedAddress && (
          <Stack
            width={'100%'}
            mt={'2rem'}
            direction={'row'}
            padding={2}
            justifyContent={'space-around'}
            alignItems={'center'}
          >
            <Button
              width={'50%'}
              fontSize={'sm'}
              rounded={'md'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500',
              }}
              _focus={{
                bg: 'blue.500',
              }}
            >
              Transfer
            </Button>
          </Stack>
        )}
      </VStack>
    </Center>
  )
}

export default SearchResultCard
