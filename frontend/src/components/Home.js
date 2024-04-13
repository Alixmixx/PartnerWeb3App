import {
  useState,
  useEffect,
  useRef,
} from 'react';
import Title from './Title';
import Web3 from 'web3';
import MainButton from './MainButton';
import PartnerInput from './PartnerInput';

export default function Home() {
  const [hasWalletWarning, setHasWalletWarning] =
    useState(false);
  const web3 = useRef(null);
  const [currentAccount, setCurrentAccount] =
    useState(null);
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

  const AddressInputs = partners.map(
    (partner, index) => {
      return (
        <PartnerInput
          address={{
            label: partner.label,
            value: partner.address,
            onChange: value => {
              setPartners(oldPartnersState => {
                const newPartnersState = [
                  ...oldPartnersState,
                ];
                newPartnersState[index].address =
                  value;
                return newPartnersState;
              });
            },
            onBlur: value => {
              setPartners(oldPartnersState => {
                const isValueAddress =
                  web3.current.utils.isAddress(
                    value
                  );
                const newPartnersState = [
                  ...oldPartnersState,
                ];
                newPartnersState[index].error =
                  isValueAddress
                    ? ''
                    : 'Enter a valid wallet address';
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
                const newPartnersState = [
                  ...oldPartnersState,
                ];
                newPartnersState[index].split =
                  value;

                return newPartnersState;
              });
            },
          }}
          key={partner.label}
        />
      );
    }
  );

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
    setHasWalletWarning(
      !checkIfWallretIsConnected()
    );
  }, []);

  useEffect(() => {
    if (
      web3.curent ||
      !checkIfWallretIsConnected()
    ) {
      return;
    }

    web3.current = new Web3(window.ethereum);
    web3.current.eth
      .getBlock('latest')
      .then(block => console.log(block));
  }, []);

  return (
    <div>
      <main>
        <Title username="Alix" />
        {hasWalletWarning && (
          <p>
            MetaMask or equivalent is required to
            use this app.
          </p>
        )}
        {!currentAccount && (
          <div>
            <MainButton
              onClick={connectWallet}
              label={'Connect Wallet'}
            />
          </div>
        )}
        {currentAccount && (
            <div>
                {AddressInputs}
            </div>
        )}
      </main>
    </div>
  );
}
