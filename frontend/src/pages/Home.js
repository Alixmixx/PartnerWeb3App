import { useState, useEffect, useRef } from 'react';
import Title from '../components/Title';
import Web3 from 'web3';
import MainButton from '../components/MainButton';
import PartnerInput from '../components/PartnerInput';
import ContractStarter from '../components/ContractStarter';
import NavigateButton from '../components/NavigateButton';
import AddressInput from '../components/AddressInput';
import ExistingAddress from '../components/ExistingAddress';

export default function Home({ setIsValid }) {
  const [hasWalletWarning, setHasWalletWarning] = useState(false);
  const web3 = useRef(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [partners, setPartners] = useState([
    {
      id: '1',
      label: 'Partner A',
      address: '',
      error: '',
      split: 1,
    },
    {
      id: '1',
      label: 'Partner B',
      address: '',
      error: '',
      split: 1,
    },
  ]);

  const allValid =
    partners.every(partner => partner.error === '') &&
    partners.every(partner => partner.address !== '');

  const AddressInputs = partners.map((partner, index) => {
    return (
      <PartnerInput
        address={{
          label: partner.label,
          value: partner.address,
          onChange: value => {
            setPartners(oldPartnersState => {
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].address = value;
              return newPartnersState;
            });
          },
          onBlur: value => {
            setPartners(oldPartnersState => {
              const isValueAddress = web3.current.utils.isAddress(value);
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].error = isValueAddress
                ? ''
                : 'Invalid address';
              return newPartnersState;
            });
          },
          error: partner.error,
        }}
        split={{
          name: partner.label,
          value: partner.split,
          onChange: value => {
            setPartners(oldPartnersState => {
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].split = value;

              return newPartnersState;
            });
          },
        }}
        key={partner.label}
      />
    );
  });

  const checkIfWallretIsConnected = () => {
    return Boolean(window.ethereum);
  };

  const connectWallet = async () => {
    if (!checkIfWallretIsConnected()) {
      return;
    }

    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsValid(allValid);
  }, [allValid, setIsValid]);

  useEffect(() => {
    setHasWalletWarning(!checkIfWallretIsConnected());
  }, []);

  useEffect(() => {
    if (web3.curent || !checkIfWallretIsConnected()) {
      return;
    }

    web3.current = new Web3(window.ethereum);
    web3.current.eth.getBlock('latest').then(block => console.log(block));
  }, []);

  return (
    <div>
      <main>
        <Title username="Alix" />
        {hasWalletWarning && (
          <p>MetaMask or equivalent is required to use this app.</p>
        )}
        {!currentAccount && (
          <div>
            <MainButton onClick={connectWallet} label={'Connect Wallet'} />
          </div>
        )}
        {currentAccount && <div>{AddressInputs}</div>}
        {allValid ? (
          <ContractStarter
            currentAccount={currentAccount}
            partners={partners}
            allValid={allValid}
            web3={web3}
          />
        ) : (
          currentAccount && <ExistingAddress currentAccount={currentAccount} />
        )}
      </main>
    </div>
  );
}
