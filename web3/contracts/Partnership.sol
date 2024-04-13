//SPDX-Lisence-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Partnership {
    address payable[] public addresses;
    uint256[] public splitRatio;
    uint256 private splitRatioTotal;

    constructor(address payable[] memory _addresses, uint256[] memory _splitRatio) {
        require(
            _addresses.length > 1,
            "More than one address should be provided to establish a partnership"
        );
        require(
            _addresses.length == _splitRatio.length,
            "The address amount and split ratio should be equal"
        );

        splitRatioTotal = getSplitRatioTotal(_splitRatio);
        addresses = _addresses;
        splitRatio = _splitRatio;
    }

    function withdraw() public {
        uint256 addressesLength = addresses.length;
        uint256 balance = getBalance();

        require(balance > 0, "Insufficient balance");
        require(balance > splitRatioTotal, "Balance should be greater than total split ratio");

        for (uint256 i = 0; i < addressesLength; i++) {
            addresses[i].transfer(
                (balance / splitRatioTotal) * splitRatio[i]
            );
        }
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getSplitRatioTotal(
        uint256[] memory _splitRatio
    ) private pure returns (uint256) {
        uint256 total = 0;

        for (uint i = 0; i < _splitRatio.length; i++) {
            require(_splitRatio[i] > 0, "Split ratio can not be less than 1");
            total += _splitRatio[i];
        }
        return total;
    }
}
