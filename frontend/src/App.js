import eth_logo from './ethereum-1.svg';
import eth_logo_gold from './ethereum-gold.svg';
import './App.css';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';
import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import ContractPage from './pages/ContractPage';

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
        logoElement.style.animation = 'none';
        setTimeout(() => {
          logoElement.style.animation = ''; // Reapply the same animation
        }, 10);
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
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Home setIsValid={setIsValid} />
              }
            />
            <Route
              path="/contract/:id"
              element={<ContractPage />}
            />
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
