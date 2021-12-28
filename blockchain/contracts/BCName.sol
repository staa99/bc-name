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

  struct AddressNames {
    uint256 length;
    mapping(string => bool) names;
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

    totalNames++;
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
  }

  function transfer(string memory name, address recipient)
  public payable
  {
    require(names[name] == msg.sender, 'Invalid attempt to transfer unowned name');
    require(msg.value >= priceUnit, 'Transfer fees must be added');

    transfers[name] = recipient;
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
  }


  function withdraw(uint256 amount)
  public payable
  {
    require(msg.sender == owner, 'Permission denied to withdraw');
    require(address(this).balance >= amount, 'Contract balance too low');

    (bool sent,) = msg.sender.call{value : amountToTransfer}('');
    require(sent, 'Failed to withdraw money from contract');
  }
}