export default function SplitInput({
  name,
  value,
  onChange,
}) {
  return (
    <>
      <label htmlFor={`split-${name}`}>
        Split
      </label>
      <input
        className="input"
        name={`split-${name}`}
        value={value}
        type="number"
        onChange={event =>
          onChange(Number(event.target.value))
        }
        placeholder={1}
        min={1}
        step={1}
      ></input>
    </>
  );
}
