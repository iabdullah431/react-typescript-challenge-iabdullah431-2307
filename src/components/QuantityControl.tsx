// components/QuantityControl.tsx
import React from 'react';

type QuantityControlProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
      <button
        onClick={onDecrease}
        className="bg-primary text-white px-2 py-1 hover:bg-primary-dark focus:bg-primary-dark focus:outline-none"
      >
        -
      </button>
      <input
        type="text"
        value={quantity}
        readOnly
        className="w-10 h-8 text-center text-sm text-gray-900 bg-white focus:outline-none"
      />
      <button
        onClick={onIncrease}
        className="bg-primary text-white px-2 py-1 hover:bg-primary-dark focus:bg-primary-dark focus:outline-none"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
