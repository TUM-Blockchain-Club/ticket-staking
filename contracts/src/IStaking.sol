// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract IStaking {
    uint256 public immutable STAKING_AMOUNT;

    mapping (address => bool) public hasStaked;

    event NewStake(address staker);
    event StakesRefunded(address[] refundAddresses);
    event StakesSlashed(address[] slashAddresses);
    
    function stake() external payable virtual;
    function stakeFor(address _staker) external payable virtual;
    function refund(address[] memory _refundAddresses) external virtual;
    function slash(address[] memory _slashAddresses) external virtual;
}
