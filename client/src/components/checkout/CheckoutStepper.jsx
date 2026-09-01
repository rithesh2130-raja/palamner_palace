import React from 'react';
import { Check, MapPin, Truck, CreditCard, ShieldCheck } from 'lucide-react';

const STEPS = [
  { id: 1, key: 'address', label: 'Address', icon: MapPin },
  { id: 2, key: 'delivery', label: 'Delivery', icon: Truck },
  { id: 3, key: 'payment', label: 'Payment', icon: CreditCard },
  { id: 4, key: 'review', label: 'Review', icon: ShieldCheck },
];

export const CheckoutStepper = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full py-4 border-b border-border bg-surface mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Connector Line Behind Icons */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-border -z-0" />

          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                disabled={step.id > currentStep}
                onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
                className={`relative z-10 flex flex-col items-center group ${
                  isCompleted ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-500/20'
                      : isCurrent
                      ? 'bg-accent text-gray-950 shadow-md ring-4 ring-accent/30 font-black scale-110'
                      : 'bg-surface-secondary text-text-tertiary border border-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>

                <span
                  className={`text-[11px] font-extrabold mt-2 tracking-tight transition-colors ${
                    isCurrent
                      ? 'text-text-primary'
                      : isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-text-tertiary'
                  }`}
                >
                  {step.id}. {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper;
