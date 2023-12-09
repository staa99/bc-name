import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { isValidDPNameOrAddress } from '../utils/validation_utils'

interface SearchBoxProps extends InputProps {
  onSearchButtonClicked(
    terms: string,
    setErrorMessage?: (err: string) => void,
  ): Promise<void>
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
        'Invalid DP name or address. DP names contain only alphanumeric characters separated by dots or dashes',
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
      <InputGroup size={size}>
        <Input onChange={onSearchTextChanged} {...inputProps} />
        <InputRightElement>
          <Button
            onClick={onButtonClick}
            paddingX={'10px'}
            width={'min-content'}
          >
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
      {!errorMessage ? (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default SearchBox
