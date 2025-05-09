// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 private count;

    event CounterInitialized(address indexed initializer, uint256 initialValue);
    event CounterIncremented(address indexed caller, uint256 newValue);

    function initialize(uint256 initialValue) external {
        count = initialValue;
        emit CounterInitialized(msg.sender, initialValue);
    }
    
    function add(uint256 value) external {
        count += value;
        emit CounterIncremented(msg.sender, count);
    }
    
    function getCount() external view returns (uint256) {
        return count;
    }
} 