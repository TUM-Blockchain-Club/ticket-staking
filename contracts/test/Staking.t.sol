// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IStaking} from "../src/IStaking.sol";
import {Staking} from "../src/Staking.sol";

contract StakingTest is Test {
    uint256 public constant STAKING_AMOUNT = 1 ether;

    Staking public staking;

    receive () external payable {}
    fallback () external payable {}

    function setUp() public {
        staking = new Staking(STAKING_AMOUNT);
    }

    // Stake

    function test_stake() public {
        staking.stake{value: STAKING_AMOUNT}();
        assertEq(staking.hasStaked(address(this)), true);
        assertEq(address(staking).balance, STAKING_AMOUNT);
    }

    function testFuzz_RevertWhen_StakeAmountMismatch(uint256 _amount) public {
        vm.assume(_amount != STAKING_AMOUNT);
        vm.expectRevert();
        staking.stake{value: _amount}();
        assertEq(staking.hasStaked(address(this)), false);
        assertEq(address(staking).balance, 0);
    }

    function test_RevertWhen_DuplicateStaking() public {
        staking.stake{value: STAKING_AMOUNT}();
        assertEq(staking.hasStaked(address(this)), true);
        vm.expectRevert();
        staking.stake{value: STAKING_AMOUNT}();
    }

    // StakeFor

    function testFuzz_StakeFor(address _staker) public {
        vm.assume(_staker != address(0));
        staking.stakeFor{value: STAKING_AMOUNT}(_staker);
        assertEq(staking.hasStaked(_staker), true);
        assertEq(address(staking).balance, STAKING_AMOUNT);
    }

    function testFuzz_RevertWhen_StakeForAmountMismatch(address _staker, uint256 _amount) public {
        vm.assume(_staker != address(0));
        vm.assume(_amount != STAKING_AMOUNT);
        vm.expectRevert();
        staking.stakeFor{value: _amount}(_staker);
        assertEq(staking.hasStaked(_staker), false);
        assertEq(address(staking).balance, 0);
    }

    function testFuzz_RevertWhen_DuplicateStakingFor(address _staker) public {
        vm.assume(_staker != address(0));
        staking.stakeFor{value: STAKING_AMOUNT}(_staker);
        assertEq(staking.hasStaked(_staker), true);
        vm.expectRevert();
        staking.stakeFor{value: STAKING_AMOUNT}(_staker);
    }

    // Refund

    function test_refund() public {
        // stake by 0x69
        address staker = address(0x69);
        vm.startPrank(staker);
        vm.deal(staker, STAKING_AMOUNT + 25 ether);
        staking.stake{value: STAKING_AMOUNT}();
        assertEq(staking.hasStaked(staker), true);
        vm.stopPrank();

        // refund 0x69 by owner
        uint256 stakerBalance = staker.balance;
        address[] memory refundAddresses = new address[](1);
        refundAddresses[0] = staker;
        staking.refund(refundAddresses);
        assertEq(address(staking).balance, 0);
        assertEq(staker.balance, stakerBalance + STAKING_AMOUNT);
    }
    
    function test_RevertWhen_NotOwnerRefunds() public {
        // stake by 0x69
        address staker = address(0x69);
        vm.deal(staker, STAKING_AMOUNT + 25 ether);
        vm.startPrank(staker);
        staking.stake{value: STAKING_AMOUNT}();
        assertEq(staking.hasStaked(staker), true);

        // refund attempt by 0x69
        address[] memory refundAddresses = new address[](1);
        refundAddresses[0] = staker;
        vm.expectRevert();
        staking.refund(refundAddresses);
        assertEq(address(staking).balance, STAKING_AMOUNT);

        vm.stopPrank();
    }

    function test_RevertWhen_RefundNonStaker() public {
        // stake by 0x69
        address staker = address(0x69);
        vm.startPrank(staker);
        vm.deal(staker, STAKING_AMOUNT + 25 ether);
        staking.stake{value: STAKING_AMOUNT}();
        assertEq(staking.hasStaked(staker), true);
        vm.stopPrank();

        // refund 0x420 attempt by owner
        address[] memory refundAddresses = new address[](1);
        refundAddresses[0] = address(0x420);
        vm.expectRevert();
        staking.refund(refundAddresses);
        assertEq(address(staking).balance, STAKING_AMOUNT);
    }

    // Slash

    function test_slash() public {
        // stake by 0x69
        address staker = address(0x69);
        vm.startPrank(staker);
        vm.deal(staker, STAKING_AMOUNT + 25 ether);
        staking.stake{value: STAKING_AMOUNT}();
        assertEq(staking.hasStaked(staker), true);
        vm.stopPrank();

        // slash 0x69 by owner
        uint256 ownerBalance = address(this).balance;
        address[] memory slashAddresses = new address[](1);
        slashAddresses[0] = staker;
        staking.slash(slashAddresses);
        assertEq(address(staking).balance, 0);
        assertEq(address(this).balance, ownerBalance + STAKING_AMOUNT);
    }
    
    function test_RevertWhen_NotOwnerSlashes() public {
        // stake by 0x69
        address staker = address(0x69);
        vm.deal(staker, STAKING_AMOUNT + 25 ether);
        vm.startPrank(staker);
        staking.stake{value: STAKING_AMOUNT}();
        assertEq(staking.hasStaked(staker), true);

        // slash attempt by 0x69
        address[] memory slashAddresses = new address[](1);
        slashAddresses[0] = staker;
        vm.expectRevert();
        staking.refund(slashAddresses);
        assertEq(address(staking).balance, STAKING_AMOUNT);

        vm.stopPrank();
    }

    function test_RevertWhen_SlashNonStaker() public {
        // stake by 0x69
        address staker = address(0x69);
        vm.startPrank(staker);
        vm.deal(staker, STAKING_AMOUNT + 25 ether);
        staking.stake{value: STAKING_AMOUNT}();
        assertEq(staking.hasStaked(staker), true);
        vm.stopPrank();

        // refund 0x420 attempt by owner
        address[] memory slashAddresses = new address[](1);
        slashAddresses[0] = address(0x420);
        vm.expectRevert();
        staking.refund(slashAddresses);
        assertEq(address(staking).balance, STAKING_AMOUNT);
    }

    // Complete Protocol

    uint256 constant public STAKER_NUM = 10;
    function test_Protocol() public {
        // Setup: create and fund STAKER_NUM accounts
        uint256 initialStakerBalance = STAKING_AMOUNT + 25 ether;
        address[STAKER_NUM] memory stakingAccounts;
        for (uint256 i = 0; i < STAKER_NUM; i++) {
            stakingAccounts[i] = address(uint160(i + 100));
            vm.deal(stakingAccounts[i], initialStakerBalance);
        }

        // Stake first half
        for (uint256 i = 0; i < STAKER_NUM/2; i++) {
            vm.prank(stakingAccounts[i]);
            staking.stake{value: STAKING_AMOUNT}();
            assertEq(stakingAccounts[i].balance, initialStakerBalance - STAKING_AMOUNT);
        }
        // StakeFor second half
        for (uint256 i = STAKER_NUM/2; i < STAKER_NUM; i++) {
            staking.stakeFor{value: STAKING_AMOUNT}(stakingAccounts[i]);
        }
        assertEq(address(staking).balance, STAKER_NUM * STAKING_AMOUNT);

        // Refund even indexes by owner
        address[] memory refundAddresses = new address[](STAKER_NUM - STAKER_NUM/2);
        uint256[] memory refundBalances = new uint256[](refundAddresses.length);
        for (uint256 i = 0; i < refundAddresses.length; i ++) {
            refundAddresses[i] = stakingAccounts[2*i];
            refundBalances[i] = refundAddresses[i].balance;
        }
        staking.refund(refundAddresses);
        assertEq(address(staking).balance, (STAKER_NUM/2) * STAKING_AMOUNT);
        for (uint256 i = 0; i < refundAddresses.length; i++) {
            assertEq(refundAddresses[i].balance, refundBalances[i] + STAKING_AMOUNT);
        }

        // Slash uneven indexes by owner
        uint256 ownerBalance = address(this).balance;
        address[] memory slashAddresses = new address[](STAKER_NUM/2);
        for (uint256 i = 0; i < slashAddresses.length; i++) {
            slashAddresses[i] = stakingAccounts[2*i + 1];
        }
        staking.slash(slashAddresses);
        assertEq(address(staking).balance, 0);
        assertEq(address(this).balance, ownerBalance + slashAddresses.length * STAKING_AMOUNT);
    }

}
