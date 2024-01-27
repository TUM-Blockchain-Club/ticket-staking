// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {console} from "forge-std/Test.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IStaking.sol";

contract Staking is IStaking, Ownable {
    constructor(uint256 _stakingAmount) Ownable(msg.sender) {
        STAKING_AMOUNT = _stakingAmount;
    }

    function stake() external payable override {
        _stake(msg.sender);
    }

    function stakeFor(address _staker) external payable override {
        require(_staker != address(0), "Staking: staker cannot be zero address");
        _stake(_staker);
    }

    function _stake(address _staker) internal {
        require(msg.value == STAKING_AMOUNT, "Staking: incorrect amount");
        require(!hasStaked[_staker], "Staking: already staked");
        hasStaked[_staker] = true;
        emit NewStake(_staker);
    }

    function refund(address[] memory _refundAddresses) external override onlyOwner {
        for (uint256 i = 0; i < _refundAddresses.length; i++) {
            address payable refundAddress = payable(_refundAddresses[i]);
            if (hasStaked[refundAddress]) {
                hasStaked[refundAddress] = false;
                refundAddress.transfer(STAKING_AMOUNT);
            } else {
                revert("Staking: refund-address must have staked");
            }
        }
        emit StakesRefunded(_refundAddresses);
    }

    function slash(address[] memory _slashAddresses) external override onlyOwner {
        for (uint256 i = 0; i < _slashAddresses.length; i++) {
            address slashAddress = _slashAddresses[i];
            if (hasStaked[slashAddress]) {
                hasStaked[slashAddress] = false;
                payable(owner()).transfer(STAKING_AMOUNT);
            } else {
                revert("Staking: slash-address must have staked");
            }
        }
        emit StakesSlashed(_slashAddresses);
    }

    fallback () external {
        revert("Staking: fallback function not allowed");
    }

    receive () external payable {
        revert("Staking: receive function not allowed");
    }
}
