import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

export default function NavigateButton({
  path,
  disabled,
  label,
  currentAccount,
}) {
  const navigate = useNavigate();

  return (
    <button
      className="button"
      onClick={() => {
        navigate(path, {
            state: {currentAccount: currentAccount}
        });
      }}
      disabled={disabled}
    >
      <span>{label}</span>
    </button>
  );
}
