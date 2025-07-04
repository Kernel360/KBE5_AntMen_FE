import { Switch } from '@headlessui/react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const Toggle = ({ enabled, onChange }: ToggleProps) => {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${
        enabled ? 'bg-primary-500' : 'bg-[#E5E7EB]'
      } relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out`}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
      />
    </Switch>
  );
}; 