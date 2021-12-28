import {
  ethers,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from 'ethers'
import { BytesLike } from '@ethersproject/bytes'
import { Listener, Provider } from '@ethersproject/providers'
import { FunctionFragment, Result } from '@ethersproject/abi'
import { TypedEventFilter, TypedEvent, TypedListener } from './commons'

interface BCNameInterface extends ethers.utils.Interface {
  functions: {
    'claim(string)': FunctionFragment
    'getAllNamesEver(address)': FunctionFragment
    'getOwner(string)': FunctionFragment
    'initialize()': FunctionFragment
    'register(string)': FunctionFragment
    'release(string)': FunctionFragment
    'transfer(string,address)': FunctionFragment
    'withdraw(uint256)': FunctionFragment
  }

  encodeFunctionData(functionFragment: 'claim', values: [string]): string
  encodeFunctionData(
    functionFragment: 'getAllNamesEver',
    values: [string]
  ): string
  encodeFunctionData(functionFragment: 'getOwner', values: [string]): string
  encodeFunctionData(functionFragment: 'initialize', values?: undefined): string
  encodeFunctionData(functionFragment: 'register', values: [string]): string
  encodeFunctionData(functionFragment: 'release', values: [string]): string
  encodeFunctionData(
    functionFragment: 'transfer',
    values: [string, string]
  ): string
  encodeFunctionData(
    functionFragment: 'withdraw',
    values: [BigNumberish]
  ): string

  decodeFunctionResult(functionFragment: 'claim', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'getAllNamesEver',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'getOwner', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'register', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'release', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result

  events: Record<string, never>
}

export class BCName extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>
  listeners(eventName?: string): Array<Listener>

  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this
  off(eventName: string, listener: Listener): this

  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this
  on(eventName: string, listener: Listener): this

  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this
  once(eventName: string, listener: Listener): this

  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this
  removeListener(eventName: string, listener: Listener): this

  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this
  removeAllListeners(eventName?: string): this

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>

  interface: BCNameInterface

  functions: {
    claim(
      name: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    getAllNamesEver(
      addr: string,
      overrides?: CallOverrides
    ): Promise<[string[]]>

    getOwner(name: string, overrides?: CallOverrides): Promise<[string]>

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    register(
      name: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    release(
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    transfer(
      name: string,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    withdraw(
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>
  }

  claim(
    name: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  getAllNamesEver(addr: string, overrides?: CallOverrides): Promise<string[]>

  getOwner(name: string, overrides?: CallOverrides): Promise<string>

  initialize(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  register(
    name: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  release(
    name: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  transfer(
    name: string,
    recipient: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  withdraw(
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  callStatic: {
    claim(name: string, overrides?: CallOverrides): Promise<void>

    getAllNamesEver(addr: string, overrides?: CallOverrides): Promise<string[]>

    getOwner(name: string, overrides?: CallOverrides): Promise<string>

    initialize(overrides?: CallOverrides): Promise<void>

    register(name: string, overrides?: CallOverrides): Promise<void>

    release(name: string, overrides?: CallOverrides): Promise<void>

    transfer(
      name: string,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>

    withdraw(amount: BigNumberish, overrides?: CallOverrides): Promise<void>
  }

  filters: Record<string, never>

  estimateGas: {
    claim(
      name: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    getAllNamesEver(addr: string, overrides?: CallOverrides): Promise<BigNumber>

    getOwner(name: string, overrides?: CallOverrides): Promise<BigNumber>

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    register(
      name: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    release(
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    transfer(
      name: string,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    withdraw(
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>
  }

  populateTransaction: {
    claim(
      name: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    getAllNamesEver(
      addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    getOwner(
      name: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    register(
      name: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    release(
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    transfer(
      name: string,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    withdraw(
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>
  }
}
