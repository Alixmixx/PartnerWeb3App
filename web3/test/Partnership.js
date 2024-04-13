const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Partnership", () => {
    let Contract, owner, person1, splitRatio;

    beforeEach(async () => {
        Contract = await hre.ethers.getContractFactory("Partnership");
        [owner, person1] = await hre.ethers.getSigners();
    })

    it("can be deployed by providing two addresses and two split", async () => {
        addresses = [owner.address, person1.address];
        splitRatio = [1, 1];

        const contract = await Contract.deploy(addresses, splitRatio);

        await contract.waitForDeployment();
    });

    it("can NOT be deployed by providing no addresses", async () => {
        let error;
        try {
            const contract = await contract.deploy(addresses, splitRatio);
            await contract.waitForDeployment();
        } catch (e) {
            error = e;
        } finally {
            expect(error).to.be.ok;
        }
    });

    it("can be deployed providing at least 2 addresses and equal amount of split", async () => {
        addresses = [owner.address, person1.address];
        splitRatio = [1, 1];

        const contract = await Contract.deploy(
            addresses,
            splitRatio,
        );

        await contract.waitForDeployment();
    });

    it("can not be deployed if the split number doesn't match the addresses number", async () => {
        addresses = [owner.address, person1.address];
        splitRatio = [1, 1, 1];

        await expect(Contract.deploy(
            addresses,
            splitRatio,
        )).to.be.revertedWith(
            "The address amount and split ratio should be equal",
        );
    });

    it("can not be deployed when the address amount is less than 2", async () => {
        addresses = [owner.address];
        splitRatio = [1];

        await expect(Contract.deploy(
            addresses,
            splitRatio,
        )).to.be.revertedWith(
            "More than one address should be provided to establish a partnership",
        );
    });

    it("can not be deployed if any split ratio is less than one", async () => {
        addresses = [owner.address, person1.address];
        splitRatio = [1, 0];

        await expect(Contract.deploy(
            addresses,
            splitRatio,
        )).to.be.revertedWith(
            "Split ratio can not be less than 1",
        );
    });

    it("can receive transactions in Ether", async () => {
        addresses = [owner.address, person1.address];
        splitRatio = [1, 1];

        const contract = await Contract.deploy(
            addresses,
            splitRatio
        );

        await contract.waitForDeployment();

        await owner.sendTransaction({
            to: contract.target,
            value: ethers.parseEther("1.2"),
        })
    })

    it("has a balance after receiving transaction", async () => {
        addresses = [owner.address, person1.address];
        splitRatio = [1, 1];
        const value = ethers.parseEther("1.2");

        const contract = await Contract.deploy(
            addresses,
            splitRatio
        );

        await contract.waitForDeployment();

        expect(await contract.getBalance()).to.equal(0);

        await owner.sendTransaction({
            to: contract.target,
            value: value
        })

        expect(await contract.getBalance()).to.equal(
            value
        );
    })
});

describe("Withdraw", () => {
    let Contract, contract, owner, person1, addresses, splitRatio;

    beforeEach(async () => {
        Contract = await hre.ethers.getContractFactory("Partnership");
        [owner, person1] = await hre.ethers.getSigners();
        addresses = [owner.address, person1.address];
        splitRatio = [1, 1];

        contract = await Contract.deploy(
            addresses,
            splitRatio
        );

        await contract.waitForDeployment();
    })

    it("can be called if the contract balance is more than zero", async () => {
        await owner.sendTransaction({
            to: contract.target,
            value: ethers.parseEther("5.0")
        });

        expect(await contract.getBalance()).to.not.equal(0);
        await contract.withdraw();
    })

    it("can not be called if the balance is less or equal to zero", async () => {
        expect(await contract.getBalance()).to.equal(0);

        await expect(contract.withdraw())
            .to.be.revertedWith("Insufficient balance",
            );
    })

    it("can not be called if the total split ratio is greater than the balance", async () => {
        splitRatio = [10, 10];

        contract = await Contract.deploy(
            addresses,
            splitRatio
        );

        expect(addresses.length).to.equal(
            splitRatio.length
        );

        await contract.waitForDeployment();

        expect(await contract.getBalance()).to.equal(0);

        await owner.sendTransaction({
            to: contract.target,
            value: ethers.parseEther("0.00000000000000001"),
        });

        expect(await contract.getBalance()).to.equal(10);

        await expect(
            contract.withdraw())
            .to.be.revertedWith("Balance should be greater than total split ratio");
    })
})
