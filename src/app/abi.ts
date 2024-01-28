const abi = [{
  "type": "constructor",
  "inputs": [{ "name": "_stakingAmount", "type": "uint256", "internalType": "uint256" }, {
    "name": "_owner",
    "type": "address",
    "internalType": "address"
  }],
  "stateMutability": "nonpayable"
}, { "type": "fallback", "stateMutability": "nonpayable" }, {
  "type": "receive",
  "stateMutability": "payable"
}, {
  "type": "function",
  "name": "STAKING_AMOUNT",
  "inputs": [],
  "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "hasStaked",
  "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
  "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "owner",
  "inputs": [],
  "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "refund",
  "inputs": [{ "name": "_refundAddresses", "type": "address[]", "internalType": "address[]" }],
  "outputs": [],
  "stateMutability": "nonpayable"
}, {
  "type": "function",
  "name": "renounceOwnership",
  "inputs": [],
  "outputs": [],
  "stateMutability": "nonpayable"
}, {
  "type": "function",
  "name": "slash",
  "inputs": [{ "name": "_slashAddresses", "type": "address[]", "internalType": "address[]" }],
  "outputs": [],
  "stateMutability": "nonpayable"
}, {
  "type": "function",
  "name": "stake",
  "inputs": [],
  "outputs": [],
  "stateMutability": "payable"
}, {
  "type": "function",
  "name": "stakeFor",
  "inputs": [{ "name": "_staker", "type": "address", "internalType": "address" }],
  "outputs": [],
  "stateMutability": "payable"
}, {
  "type": "function",
  "name": "transferOwnership",
  "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }],
  "outputs": [],
  "stateMutability": "nonpayable"
}, {
  "type": "event",
  "name": "NewStake",
  "inputs": [{ "name": "staker", "type": "address", "indexed": false, "internalType": "address" }],
  "anonymous": false
}, {
  "type": "event",
  "name": "OwnershipTransferred",
  "inputs": [{
    "name": "previousOwner",
    "type": "address",
    "indexed": true,
    "internalType": "address"
  }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }],
  "anonymous": false
}, {
  "type": "event",
  "name": "StakesRefunded",
  "inputs": [{ "name": "refundAddresses", "type": "address[]", "indexed": false, "internalType": "address[]" }],
  "anonymous": false
}, {
  "type": "event",
  "name": "StakesSlashed",
  "inputs": [{ "name": "slashAddresses", "type": "address[]", "indexed": false, "internalType": "address[]" }],
  "anonymous": false
}, {
  "type": "error",
  "name": "OwnableInvalidOwner",
  "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }]
}, {
  "type": "error",
  "name": "OwnableUnauthorizedAccount",
  "inputs": [{ "name": "account", "type": "address", "internalType": "address" }]
}] as const

export default abi
