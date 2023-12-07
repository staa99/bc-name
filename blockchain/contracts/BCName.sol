//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BCName is Initializable, OwnableUpgradeable, UUPSUpgradeable {
  uint256 private priceUnit;
  uint256 public totalNames;
  mapping(string => address) private names;
  mapping(string => address) private transfers;
  mapping(address => AddressNames) private addressNames;

  event NameRegistered(address indexed registrant, string name);
  event NameReleased(address indexed registrant, string name);
  event NameTransferInitiated(address indexed from, address indexed to, string name);
  event NameTransferCompleted(address indexed from, address indexed to, string name);

  struct AddressNames {
    uint256 length;
    string[] allNamesEver;
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(uint256 _priceUnit) initializer public {
    __Ownable_init();
    __UUPSUpgradeable_init();
    priceUnit = _priceUnit;
  }

  function register(string memory name)
  public payable
  {
    // validation
    if (names[name] == msg.sender) {
      return;
    }
    require(names[name] == address(0), "NAME_NOT_AVAILABLE");
    require(msg.value >= getLinkingPrice(name), "REGISTRATION_FEES_REQUIRED");

    // set names
    names[name] = msg.sender;
    addressNames[msg.sender].length++;
    addressNames[msg.sender].allNamesEver.push(name);

    totalNames++;

    emit NameRegistered(msg.sender, name);
  }

  function release(string memory name)
  public
  {
    require(names[name] == msg.sender, "PERMISSION_DENIED");

    names[name] = address(0);
    transfers[name] = address(0);

    addressNames[msg.sender].length--;
    totalNames--;

    emit NameReleased(msg.sender, name);
  }

  function transfer(string memory name, address recipient)
  public payable
  {
    require(names[name] == msg.sender, "PERMISSION_DENIED");
    require(recipient != msg.sender, "SAME_ADDRESS_TRANSFER_INVALID");
    require(msg.value >= getTransferPrice(name), "TRANSFER_FEES_REQUIRED");

    transfers[name] = recipient;
    emit NameTransferInitiated(msg.sender, recipient, name);
  }

  function claim(string memory name)
  public payable
  {
    require(transfers[name] == msg.sender, "PERMISSION_DENIED");

    // Reduce the name count of the original owner
    address originalOwner = names[name];
    addressNames[originalOwner].length--;
    transfers[name] = address(0);

    names[name] = msg.sender;
    addressNames[msg.sender].length++;

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

    require(names[name] == address(0), "NAME_NOT_AVAILABLE");
    return priceUnit * addressNames[msg.sender].length;
  }

  function getTransferPrice(string memory name)
  public view
  returns (uint256)
  {
    // validation
    require(names[name] == msg.sender, "PERMISSION_DENIED");
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
  public payable onlyOwner
  {
    require(address(this).balance >= amount, "INSUFFICIENT_BALANCE");

    (bool sent,) = msg.sender.call{value : amount}("");
    require(sent, "WITHDRAWAL_FAILED");
  }

  function _authorizeUpgrade(address newImplementation)
  internal onlyOwner override
  {}
}