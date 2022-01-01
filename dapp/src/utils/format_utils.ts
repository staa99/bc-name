import { BigNumberish, ethers } from 'ethers'

export const formatPrice = (price: BigNumberish) =>
  `${ethers.utils.formatEther(price)} ${
    process.env.NEXT_PUBLIC_NETWORK_CURRENCY
  }`
