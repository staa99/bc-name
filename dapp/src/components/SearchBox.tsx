import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react'
import { ThemeTypings } from '@chakra-ui/styled-system'
import { ChangeEvent, useState } from 'react'
import { isValidDPNameOrAddress } from '../utils/validation_utils'

interface SearchBoxProps extends InputProps {
  onSearchButtonClicked(
    terms: string,
    setErrorMessage?: (err: string) => void
  ): Promise<void>
  size?:
    | ThemeTypings['components']['Button']['sizes']
    | ThemeTypings['components']['Input']['sizes']
  helperText?: string
}

const SearchBox = ({
  onSearchButtonClicked,
  size,
  helperText,
  ...inputProps
}: SearchBoxProps) => {
  const [searchText, setSearchText] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()

  const onButtonClick = async () => {
    if (!isValidDPNameOrAddress(searchText)) {
      setErrorMessage(
        'Invalid DP name or address. DP names contain only alphanumeric characters separated by dots or dashes'
      )
      return
    }

    if (searchText) {
      await onSearchButtonClicked(searchText, setErrorMessage)
    }
  }

  const onSearchTextChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
    setErrorMessage(undefined)
  }

  return (
    <FormControl isInvalid={!!errorMessage}>
      <Input size={size} onChange={onSearchTextChanged} {...inputProps} />
      <InputRightElement>
        <Button onClick={onButtonClick} size={size}>
          Search
        </Button>
      </InputRightElement>
      {!errorMessage ? (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default SearchBox
