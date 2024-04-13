export default function AddressInput({
  label,
  value,
  onChange,
  onBlur,
  error,
}) {
  return (
    <>
      <label htmlFor={label}>{label}</label>
      <input
        className="input"
        name={label}
        value={value}
        type="text"
        onChange={event =>
          onChange(event.target.value)
        }
        onBlur={event =>
          onBlur(event.target.value)
        }
        placeholder="Wallet Address"
      />
      {error ? <p>{error}</p> : <p>&nbsp;</p>}
    </>
  );
}
