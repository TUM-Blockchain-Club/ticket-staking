// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

abstract contract IStaking {
    uint256 public immutable STAKING_AMOUNT;

    mapping (address => bool) public hasStaked;

    event NewStake(address staker);
    event StakesRefunded(address[] stakers);
    event StakesSlashed(address[] stakers);
    
    function stake() external payable virtual;
    function stakeFor(address staker) external payable virtual;
    function refund(address[] memory refunds) external virtual;
    function slash(address[] memory slashes) external virtual;
}
