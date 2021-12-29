//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BCName is Initializable {
  uint256 constant priceUnit = 0.0001 ether;
  address owner;
  uint256 totalNames;
  mapping(string => address) private names;
  mapping(string => address) private transfers;
  mapping(address => AddressNames) private addressNames;

  event NameRegistered(address indexed registrant, string name);
  event NameReleased(address indexed registrant, string name);
  event NameTransferInitiated(address indexed from, address indexed to, string name);
  event NameTransferCompleted(address indexed from, address indexed to, string name);

  struct AddressNames {
    uint256 length;
    mapping(string => bool) names;
    string[] allNamesEver;
  }

  constructor() payable {}

  function initialize()
  public initializer
  {
    owner = msg.sender;
  }

  function register(string memory name)
  public payable
  {
    // validation
    if (names[name] == msg.sender) {
      return;
    }
    require(names[name] == address(0), 'Name is already mapped to another address');
    require(msg.value >= priceUnit * addressNames[msg.sender].length, 'Price requirements must be satisfied');

    // set names
    names[name] = msg.sender;
    addressNames[msg.sender].length++;
    addressNames[msg.sender].names[name] = true;
    addressNames[msg.sender].allNamesEver.push(name);

    totalNames++;

    emit NameRegistered(msg.sender, name);
  }

  function release(string memory name)
  public
  {
    require(names[name] == msg.sender, 'Invalid attempt to release unowned name');

    names[name] = address(0);
    transfers[name] = address(0);

    addressNames[msg.sender].length--;
    addressNames[msg.sender].names[name] = false;
    totalNames--;

    emit NameReleased(msg.sender, name);
  }

  function transfer(string memory name, address recipient)
  public payable
  {
    require(names[name] == msg.sender, 'Invalid attempt to transfer unowned name');
    require(recipient != msg.sender, 'Cannot transfer to same address');
    require(msg.value >= priceUnit, 'Transfer fees must be added');

    transfers[name] = recipient;
    emit NameTransferInitiated(msg.sender, recipient, name);
  }

  function claim(string memory name)
  public payable
  {
    require(transfers[name] == msg.sender, 'Invalid attempt to claim an unowned transfer');

    // Reduce the name count of the original owner
    address originalOwner = names[name];
    addressNames[originalOwner].length--;
    addressNames[originalOwner].names[name] = false;
    transfers[name] = address(0);

    names[name] = msg.sender;
    addressNames[msg.sender].length++;
    addressNames[msg.sender].names[name] = true;

    emit NameTransferCompleted(originalOwner, msg.sender, name);
  }

  function getLinkingPrice(string memory name)
  public view
  returns (uint256)
  {
    // validation
    if (names[name] == msg.sender) {
      return 0;
    }

    require(names[name] == address(0), 'Name is already mapped to another address');
    return priceUnit * addressNames[msg.sender].length;
  }

  function getTransferPrice(string memory name)
  public view
  returns (uint256)
  {
    // validation
    require(names[name] == msg.sender, 'Invalid attempt to transfer unowned name');
    return priceUnit;
  }

  function getTransferOwner(string memory name)
  public view
  returns (address)
  {
    return transfers[name];
  }

  function getOwner(string memory name)
  public view
  returns (address)
  {
    return names[name];
  }

  function getAllNamesEver(address addr)
  public view
  returns (string[] memory)
  {
    return addressNames[addr].allNamesEver;
  }

  function withdraw(uint256 amount)
  public payable
  {
    require(msg.sender == owner, 'Permission denied to withdraw');
    require(address(this).balance >= amount, 'Contract balance too low');

    (bool sent,) = msg.sender.call{value : amount}('');
    require(sent, 'Failed to withdraw money from contract');
  }
}