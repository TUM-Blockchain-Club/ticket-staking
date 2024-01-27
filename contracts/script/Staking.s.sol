// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Staking} from "../src/Staking.sol";

contract StakingScript is Script {
    function setUp() public {}

    function run() public {
        address ownerAddress = vm.envAddress("OWNER_ADDRESS");
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Staking staking = new Staking(1 gwei, ownerAddress);

        vm.stopBroadcast();
    }
}
