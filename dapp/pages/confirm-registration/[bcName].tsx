import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  AccountNotLinkedError,
  BCNameStatus,
  NameNotAvailableError,
  RegistrationFailedError,
} from '../../src/utils/status'
import { formatPrice } from '../../src/utils/format_utils'
import { useBCNameContract } from '../../src/web3/BCNameContractContext'

const ConfirmRegistration: NextPage = () => {
  const router = useRouter()
  const bcName = router.query.bcName as string
  const [status, setStatus] = useState<BCNameStatus>()
  const [loading, setLoading] = useState(true)
  const { contract, selectedAddress } = useBCNameContract()
  const [price, setPrice] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!contract || !bcName) {
      return
    }

    // eslint-disable-next-line prettier/prettier
    (async () => {
      const p = await contract.getLinkingPrice(bcName)
      if (p) {
        setPrice(p)
      } else {
        setStatus(NameNotAvailableError)
      }
      setLoading(false)
    })()
  }, [contract, bcName])

  const confirmRegistration = async () => {
    if (!contract) {
      setStatus(AccountNotLinkedError)
      return
    }

    const status = await contract.registerName(bcName)
    if (status) {
      await router.push(`/search/${bcName}`)
    } else {
      setStatus(RegistrationFailedError)
    }
  }

  return (
    <Container maxWidth={600} padding={0}>
      <VStack height={'100vh'} paddingY={20}>
        <Heading>Confirm Name Linking</Heading>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Text>{bcName}</Text>
        </FormControl>
        <FormControl>
          <FormLabel>Price</FormLabel>
          <Text>{formatPrice(price)}</Text>
        </FormControl>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Text>{selectedAddress}</Text>
        </FormControl>
        <Button disabled={loading || !!status} onClick={confirmRegistration}>
          {loading ? 'Loading' : status ? status.message : 'Confirm'}
        </Button>
      </VStack>
    </Container>
  )
}

export default ConfirmRegistration
