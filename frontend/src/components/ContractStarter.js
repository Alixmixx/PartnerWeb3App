import { useState, useRef } from 'react';
import MainButton from './MainButton';
import Partnership from '../abis/Partnership.json';
import NavigateButton from './NavigateButton';

export default function ContractStarter({
  currentAccount,
  partners,
  allValid,
  web3,
}) {
  const [isDeploying, setIsDeploying] =
    useState(false);
  const [
    deployedContractAddress,
    setDeployedContractAddress,
  ] = useState(null);

  const handleStartPartnership = async () => {
    console.log(partners);
    const addresses = [
      partners[0].address,
      partners[1].address,
    ];
    const splitRatio = [
      partners[0].split,
      partners[1].split,
    ];
    const contractArguments = [
      addresses,
      splitRatio,
    ];

    try {
      const { abi, bytecode } = Partnership;
      const contract =
        new web3.current.eth.Contract(abi);

      const contractDeploymentData = {
        data: bytecode,
        arguments: contractArguments,
      };

      console.log(web3.current);

      const gas = await contract
        .deploy(contractDeploymentData)
        .estimateGas();

      setIsDeploying(true);

      contract
        .deploy(contractDeploymentData)
        .send({
          from: currentAccount,
          gas: gas,
        })
        .on('error', error => {
          console.log('Error:', error);
          setIsDeploying(false);
        })
        .on('receipt', receipt => {
          console.log('Receipt:', receipt);
          setIsDeploying(false);
          setDeployedContractAddress(
            receipt.contractAddress
          );
        })
        .on(
          'confirmation',
          (_confirmationNumber, receipt) => {
            console.log('Confirmation:', receipt);
            setIsDeploying(false);
          }
        );
    } catch (error) {
      console.log(
        'Failed to estimate gas:',
        error
      );
      setIsDeploying(false);
    }
  };

  return (
    <>
      <div>
        {deployedContractAddress ? (
          <NavigateButton
            path={`contract/${deployedContractAddress}`}
            label={`Go to contract`}
            currentAccount={currentAccount}
          />
        ) : (
          <MainButton
            onClick={handleStartPartnership}
            label={
              isDeploying
                ? 'Deploying'
                : 'Partner Up!'
            }
          />
        )}
      </div>
    </>
  );
}
