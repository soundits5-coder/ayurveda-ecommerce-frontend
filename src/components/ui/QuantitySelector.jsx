import React from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';

const QuantitySelector = ({ quantity, onIncrease, onDecrease, min = 1, max = 99 }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="px-3 py-2 text-dark-body hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <LuMinus className="w-4 h-4" />
      </button>
      <div className="px-4 py-2 text-center font-medium min-w-[40px] border-x border-gray-300 bg-white">
        {quantity}
      </div>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="px-3 py-2 text-dark-body hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <LuPlus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
