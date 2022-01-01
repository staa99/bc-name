import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { BCNameProvider } from '../src/web3/BCNameContractContext'

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <BCNameProvider>
        <Component {...pageProps} />
      </BCNameProvider>
    </ChakraProvider>
  )
}

export default App
