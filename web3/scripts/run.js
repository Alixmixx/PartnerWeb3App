const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    await hre.run("compile");
    const [owner, person1, person2] =
        await hre.ethers.getSigners();
    const splitRatio = [4, 1];
    const addresses = [
        person1.address,
        person2.address,
    ];

    const Contract =
        await hre.ethers.getContractFactory(
            "Partnership",
        );

    const provider = hre.ethers.provider;
    const contract =
        await Contract.deploy(
            addresses,
            splitRatio
        );

    await contract.waitForDeployment();

    console.log(
        "Contract deployed to:",
        contract.target,
    );

    console.log(`Split ratio is: ${splitRatio}`)

    let balance1 = await provider.getBalance(
        person1.address
    );
    console.log(
        `Person1 balance is ${ethers.formatEther(balance1)}`
    )

    let balance2 = await provider.getBalance(
        person2.address
    );
    console.log(
        `Person2 balance is ${ethers.formatEther(balance2)}`
    )

    let contractBalance = await contract.getBalance();
    console.log(`Contract balance is ${ethers.formatEther(contractBalance)}`);

    await owner.sendTransaction({
        to: contract.target,
        value: ethers.parseEther("5000"),
    });

    console.log(`Contract balance after transaction is: ${ethers.formatEther(await contract.getBalance())}`)

    await contract.withdraw();

    console.log(`Contract balance after withdraw is: ${ethers.formatEther(await contract.getBalance())}`)

    balance1 = await provider.getBalance(
        person1.address
    );
    console.log(
        `Person1 balance is ${ethers.formatEther(balance1)}`
    )

    balance2 = await provider.getBalance(
        person2.address
    );
    console.log(
        `Person2 balance is ${ethers.formatEther(balance2)}`
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
