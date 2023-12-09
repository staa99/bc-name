import { Button, Center, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { BigNumber, BigNumberish } from 'ethers'
import { formatPrice } from '../utils/format_utils'

interface GetNameCardProps {
  name: string
  price: BigNumberish
  linkName(): Promise<void>
}

const GetNameCard = ({ name, price, linkName }: GetNameCardProps) => {
  const formattedPrice = formatPrice(price)
  return (
    <Center py={6} width={'100%'}>
      <VStack
        justifyContent="center"
        alignItems="center"
        p={1}
        pt={2}
        width={'100%'}
      >
        <Heading fontSize={'md'} fontFamily={'body'}>
          {name} is available
        </Heading>
        <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
          {BigNumber.from(price).gt(0)
            ? `Pay ${formattedPrice} to link your address`
            : 'Link your address for free'}
        </Text>

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
            size={'md'}
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
            onClick={linkName}
          >
            Link
          </Button>
        </Stack>
      </VStack>
    </Center>
  )
}

export default GetNameCard
