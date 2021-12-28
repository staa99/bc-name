import { ethers } from 'ethers'

const dpNameRegex = /^(?:[a-zA-Z0-9_]+[.-]?)*[a-zA-Z0-9_]+$/
export const isValidDPNameOrAddress = (
  text: string | null | undefined
): boolean => {
  if (!text) return false
  if (ethers.utils.isAddress(text)) {
    return true
  }
  const trimmedText = text.trim()
  return trimmedText.length > 0 && dpNameRegex.test(trimmedText)
}
