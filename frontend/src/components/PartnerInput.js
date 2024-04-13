import AddressInput from './AddressInput';
import SplitInput from './SplitInput';

export default function PartnerInput({
  address,
  split,
}) {
  return (
    <div className="flex">
      <AddressInput
        label={address.label}
        value={address.value}
        onChange={address.onChange}
        onBlur={address.onBlur}
        error={address.error}
      />
      <SplitInput
        name={split.name}
        value={split.value}
        onChange={split.onChange}
      />
    </div>
  );
}
