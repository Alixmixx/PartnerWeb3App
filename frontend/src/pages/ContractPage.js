import { useEffect, useRef, useState } from 'react';
import MainButton from '../components/MainButton';
import { useParams, useLocation, useAsyncValue } from 'react-router-dom';
import SendTransactionInput from '../components/SendTransactionInput';
import Partnership from '../abis/Partnership.json';
import Web3 from 'web3';

export default function ContractPage({}) {
  const { id } = useParams();
  const location = useLocation();
  const currentAccount = location.state.currentAccount;
  const [contractAddress, setcontractAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [splitRatios, setSplitRatios] = useState([]);
  const [contractBalance, setContractBalance] = useState('0');
  const web3 = useRef(null);
  const contract = useRef(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (!web3.current) {
        web3.current = new Web3(window.ethereum);
      }
    };
    initWeb3();
    setcontractAddress(id);
  }, []);

  // Get contract infos
  useEffect(() => {
    const { abi } = Partnership;
    contract.current = new web3.current.eth.Contract(abi, contractAddress);

    console.log('Contract', contract);
    console.log('address', contractAddress);
    const loadContractData = async () => {
      try {
        const addressesLength = await contract.current.methods
          .getAddressesLength()
          .call();
        const splitRatiosLength = await contract.current.methods
          .getSplitRatiosLength()
          .call();

        const addressesPromises = [];
        const splitRatiosPromises = [];

        for (let i = 0; i < addressesLength; i++) {
          addressesPromises.push(contract.current.methods.addresses(i).call());
        }
        for (let i = 0; i < splitRatiosLength; i++) {
          splitRatiosPromises.push(
            contract.current.methods.splitRatio(i).call()
          );
        }

        const addresses = await Promise.all(addressesPromises);
        const splitRatios = await Promise.all(splitRatiosPromises);
        const balanceInWei = await contract.current.methods.getBalance().call();
        const balanceInEther = web3.current.utils.fromWei(balanceInWei, 'ether');
        
        setContractBalance(parseFloat(balanceInEther));
        setAddresses(addresses);
        setSplitRatios(splitRatios);
      } catch (error) {
        console.error('Error fetching contract data:', error);
      }
    };

    loadContractData();
  }, [contractAddress, isProcessing]);

  // Withdraw
  const handleWithdraw = async () => {
    if (!contract.current) {
      console.error('Contract is not initialized.');
      return;
    }

    try {
      const gas = await contract.current.methods
        .withdraw()
        .estimateGas({ from: currentAccount });
      setIsProcessing(true);

      contract.current.methods
        .withdraw()
        .send({ from: currentAccount, gas })
        .on('error', error => {
          console.error('Error on withdraw:', error);
          setIsProcessing(false);
        })
        .on('receipt', receipt => {
          console.log('Receipt:', receipt);
          setIsProcessing(false);
        })
        .on('confirmation', (_confirmationNumber, receipt) => {
          console.log('Confirmed:', receipt);
        });
    } catch (error) {
      console.error('Withdraw failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <h2>Current Contract {contractAddress}</h2>
      <h2>Contract Balance {contractBalance} ETH</h2>
      <ul className="list_box">
        <li className="flex">
          <div className="list_element">Partners address</div>
          <div className="list_element">Split</div>
        </li>
        {addresses.map((address, index) => (
          <li key={index} className="flex">
            <div className="list_element">{address}</div>
            <div className="list_element">{Number(splitRatios[index])}</div>
          </li>
        ))}
      </ul>
      <div>
        <SendTransactionInput
          currentAccount={currentAccount}
          contract={contract}
          web3={web3}
        />
      </div>
      <div>
        <MainButton
          onClick={handleWithdraw}
          label="Withdraw"
          disabled={isProcessing}
        />
      </div>
    </>
  );
}
