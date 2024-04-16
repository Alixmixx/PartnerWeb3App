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
  const [amount, setAmount] = useState(0);

  const [addresses, setAddresses] = useState([]);
  const [splitRatios, setSplitRatios] = useState([]);
  const [contractBalance, setContractBalance] = useState('0');
  const web3 = useRef(null);
  let contract = null;

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
    contract = new web3.current.eth.Contract(abi, contractAddress);

    console.log('Contract', contract);
    console.log('address', contractAddress);
    const loadContractData = async () => {
      try {
        const addressesLength = await contract.methods
          .getAddressesLength()
          .call();
        const splitRatiosLength = await contract.methods
          .getSplitRatiosLength()
          .call();

        const addressesPromises = [];
        const splitRatiosPromises = [];

        for (let i = 0; i < addressesLength; i++) {
          addressesPromises.push(contract.methods.addresses(i).call());
        }
        for (let i = 0; i < splitRatiosLength; i++) {
          splitRatiosPromises.push(contract.methods.splitRatio(i).call());
        }

        const addresses = await Promise.all(addressesPromises);
        const splitRatios = await Promise.all(splitRatiosPromises);

        setAddresses(addresses);
        setSplitRatios(splitRatios);
      } catch (error) {
        console.error('Error fetching contract data:', error);
      }
    };

    loadContractData();
  }, [contractAddress]);

  // Withdraw
  const handleWithdraw = async () => {
    const { abi } = Partnership;
    const contract = new web3.current.eth.Contract(abi, contractAddress);

    const gas = await contract.methods.withdraw().estimateGas();
    setIsProcessing(true);

    contract.methods
      .withdraw()
      .send({ from: currentAccount, gas })
      .on('error', error => {
        console.log('error', error);
        setIsProcessing(false);
      })
      .on('receipt', receipt => {
        console.log('Receipt', receipt);
        setIsProcessing(false);
      })
      .on('confirmation', (_confirmationNumber, receipt) => {
        console.log('Confirmed', receipt);
      });
  };

  return (
    <>
      <h2>Current Contract {contractAddress}</h2>
      <h2>Contract Balance {contractBalance}</h2>
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
