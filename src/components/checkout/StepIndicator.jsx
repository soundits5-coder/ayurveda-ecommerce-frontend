import React from 'react';
import { LuCheck } from 'react-icons/lu';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Shipping' },
    { id: 2, label: 'Payment' },
    { id: 3, label: 'Confirmation' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Connecting Lines */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-ayurveda -z-10 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center bg-white px-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors duration-300 ${
                step.id < currentStep
                  ? 'bg-ayurveda text-white' // Completed
                  : step.id === currentStep
                    ? 'bg-ayurveda text-white ring-4 ring-ayurveda-light/30' // Current
                    : 'bg-gray-200 text-gray-500' // Upcoming
              }`}
            >
              {step.id < currentStep ? <LuCheck className="w-5 h-5" /> : step.id}
            </div>
            <span className={`mt-2 text-xs md:text-sm font-medium ${step.id <= currentStep ? 'text-dark' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
