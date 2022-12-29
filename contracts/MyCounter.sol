// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

contract MyCounter {
    using Counters for Counters.Counter;

    Counters.Counter private _counter;

    event Increment(uint256 number);

    function incrementCounter() public {
        _counter.increment();

        emit Increment(_counter.current());
    }

    function getCount() public view returns (uint256) {
        return _counter.current();
    }
}