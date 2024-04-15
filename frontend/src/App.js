import eth_logo from './ethereum-1.svg';
import eth_logo_gold from './ethereum-gold.svg';
import './App.css';
import Home from './components/Home';
import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
function App() {
  const [isValid, setIsValid] = useState(false);
  const [currentLogo, setCurrentLogo] =
    useState(eth_logo);
  const [currentCss, setCurrentCss] =
    useState('eth_logo');
  const logoRef = useRef(null);

  useEffect(() => {
    if (logoRef.current) {
      const handleAnimationEnd = () => {
        console.log(
          'Animation ended, updating logo and class'
        );
        setCurrentLogo(
          isValid ? eth_logo_gold : eth_logo
        );
        setCurrentCss(
          isValid ? 'eth_logo_gold' : 'eth_logo'
        );
      };

      const logoElement = logoRef.current;
      logoElement.addEventListener(
        'animationend',
        handleAnimationEnd
      );

      return () => {
        logoElement.removeEventListener(
          'animationend',
          handleAnimationEnd
        );
      };
    }
  }, [isValid]);

  return (
    <div className="App">
      <header className="App-header">
        <img
          ref={logoRef}
          src={currentLogo}
          className={currentCss}
          alt="eth_logo"
        />
        <Home setIsValid={setIsValid} />
      </header>
    </div>
  );
}

export default App;
