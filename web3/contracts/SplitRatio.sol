// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract SplitRatio {
    uint[] public splitRatios;

    constructor(uint[] memory _splitRatio) {
        require(_splitRatio.length > 1, "Array is too small");
        checkSplitRatio(_splitRatio);
    }

    function checkSplitRatio(
        uint[] memory _splitRatio
    ) private pure {
        for (uint i = 0; i < _splitRatio.length; i++) {
            require(_splitRatio[i] >= 5, "Must be greater or equal to 5");
        }
    }
}
