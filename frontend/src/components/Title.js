import { useEffect, useState } from "react";

export default function Title(props) {

    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        setWalletConnected(checkIfWallretIsConnected);
    }, []);

    const checkIfWallretIsConnected = () => {
        return Boolean(window.ethereum);
    }

    return (
        <>
            <h1>
                Hello {props.username}
            </h1>
            {!walletConnected && 
                (<h2>
                    No wallet connected
                </h2>) ||
                (<h2>
                    Wallet detected
                </h2>)
            }
        </>
    )
}