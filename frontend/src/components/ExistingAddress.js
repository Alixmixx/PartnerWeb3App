import React, { useEffect, useState } from 'react';
import AddressInput from './AddressInput';
import NavigateButton from './NavigateButton';
import { isAddress } from 'web3-validator';

export default function ExistingAddress({ currentAccount }) {
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState(false);

  const onChange = (value) => {
    setAddress(value);
  };

  useEffect(() => {
    setIsValid(isAddress(address));
  }, [address]);

  return (
    <>
      <AddressInput
        label="Existing address"
        value={address}
        onChange={(value) => onChange(value)}
        onBlur={(value) => onChange(value)} // Typically onBlur isn't needed if onChange is already capturing the input
      />
      <NavigateButton
        path={`contract/${address}`}
        label="Go to existing contract"
        currentAccount={currentAccount}
        disabled={!isValid}
      />
    </>
  );
}
