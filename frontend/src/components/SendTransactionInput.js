import { useState } from "react";
import MainButton from "./MainButton";

export default function SendTransactionInput({
  currentAccount,
  contract,
}) {
  const [amount, setAmount] = useState(1);
  
  const handlePayment = async () => {
    await contract.methods
      .receive()
      .send({
        value: amount,
        from: currentAccount,
      })
      .once('transactionHash', function (hash) {
        console.log('Transaction hash received', hash);
      })
      .once('receipt', function (receipt) {
        console.log('Transaction receipt received', receipt);
      })
      .on('confirmation', function (confNumber, receipt) {
        console.log('Transaction hash received', confNumber);
      });
  };

  const onChange = (value) => {
    setAmount(value);
  }

  return (
    <>
      <label htmlFor='payment'>Amount to Send:</label>
      <input
        className="input"
        id="payment"
        name="Send"
        value={amount}
        type="number"
        onChange={event => onChange(Number(event.target.value))}
        placeholder="1"
        min={0.01}
        step={0.01}
      ></input>
      <MainButton
        onClick={handlePayment}
        label="Send ETH"
      />
    </>
  );
}
