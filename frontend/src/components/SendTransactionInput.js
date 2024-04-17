import { useState } from 'react';
import MainButton from './MainButton';

export default function SendTransactionInput({
  currentAccount,
  contract,
  web3,
}) {
  const [amount, setAmount] = useState(0.03);

  console.log('Contract payment', contract);

  const handlePayment = async () => {
    try {
      const valueInWei = web3.current.utils.toWei(amount.toString(), 'ether');

      const transactionParameters = {
        to: contract.current.options.address,
        from: currentAccount,
        value: valueInWei,
      };

      await web3.current.eth
        .sendTransaction(transactionParameters)
        .on('transactionHash', function (hash) {
          console.log('Transaction hash received:', hash);
        })
        .on('receipt', function (receipt) {
          console.log('Transaction receipt received:', receipt);
        })
        .on('confirmation', function (confNumber, receipt) {
          console.log('Transaction confirmed:', confNumber);
        });
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const onChange = value => {
    setAmount(value);
  };

  return (
    <>
      <label htmlFor="payment">Amount to Send:</label>
      <input
        className="input"
        id="payment"
        name="Send"
        value={amount}
        type="number"
        onChange={event => onChange(Number(event.target.value))}
        placeholder="0.03"
        min={0.01}
        step={0.01}
      ></input>
      <MainButton onClick={handlePayment} label="Send ETH" />
    </>
  );
}
