import React from "react";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const ToggleSwitch = ({ isOn, onToggle }: ToggleSwitchProps) => (
  <div
    className={`w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer ${
      isOn ? 'bg-[#00BCD4] justify-end' : 'bg-gray-200 justify-start'
    }`}
    onClick={onToggle}
  >
    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
  </div>
);

export default ToggleSwitch; 