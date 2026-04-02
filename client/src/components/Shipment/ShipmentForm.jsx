import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { shipmentRouteSchema } from '@/utils/validators';
import { INDIAN_CITIES } from '@/utils/constants';

export function ShipmentForm({ onSubmit, onCancel, isLoading }) {
  const [step, setStep] = useState(1);
  const [isSplit, setIsSplit] = useState(false);
  const [routeData, setRouteData] = useState(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(shipmentRouteSchema) });

  const handleStep1 = (data) => {
    setRouteData(data);
    setStep(2);
  };

  const handleStep2Next = () => setStep(3);

  const handleFinalSubmit = () => {
    onSubmit({ ...routeData, isSplit });
  };

  const steps = ['Route & Capacity', 'Shipment Type', 'Review'];

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${done ? 'bg-teal-600 text-white' : active ? 'bg-teal-100 text-teal-700 border-2 border-teal-600' : 'bg-gray-100 text-gray-400'}`}>
                {done ? '✓' : n}
              </div>
              <span className={`text-sm hidden sm:block ${active ? 'text-teal-700 font-medium' : 'text-gray-400'}`}>{label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${done ? 'bg-teal-600' : 'bg-gray-200'}`} />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Route & Capacity */}
      {step === 1 && (
        <form onSubmit={handleSubmit(handleStep1)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">From Location</label>
              <input 
                type="text" 
                {...register('fromLocation')} 
                className="input-field" 
                placeholder="e.g. Chennai" 
              />
              {errors.fromLocation && <p className="error-text">{errors.fromLocation.message}</p>}
            </div>
            <div>
              <label className="label">To Location</label>
              <input 
                type="text" 
                {...register('toLocation')} 
                className="input-field" 
                placeholder="e.g. Coimbatore" 
              />
              {errors.toLocation && <p className="error-text">{errors.toLocation.message}</p>}
            </div>
          </div>

          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-sm font-semibold text-gray-700 px-2">Required Capacity</legend>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Weight (kg)', name: 'requiredWeight', placeholder: '2000' },
                { label: 'Volume (m³)', name: 'requiredVolume', placeholder: '12' },
                { label: 'Length (m)', name: 'requiredLength', placeholder: '6' },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="label">{label}</label>
                  <input {...register(name)} type="number" min="0.01" step="any" placeholder={placeholder} className="input-field" />
                  {errors[name] && <p className="error-text">{errors[name].message}</p>}
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">Next →</button>
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {/* Step 2: Split or Single */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">How do you want to ship this?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { value: false, label: 'Single Truck', icon: '🚛', desc: 'All cargo in one truck. Simpler booking.' },
              { value: true,  label: 'Multiple Trucks', icon: '🚛🚛', desc: 'Split cargo across trucks. More flexibility.' },
            ].map(({ value, label, icon, desc }) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => setIsSplit(value)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${isSplit === value ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <p className="text-2xl mb-2">{icon}</p>
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleStep2Next} className="btn-primary flex-1">Next →</button>
            <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && routeData && (
        <div className="space-y-5">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-gray-900">Shipment Summary</h3>

            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-gray-900">{routeData.fromLocation}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="font-medium text-gray-900">{routeData.toLocation}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Weight', val: routeData.requiredWeight, unit: 'kg' },
                { label: 'Volume', val: routeData.requiredVolume, unit: 'm³' },
                { label: 'Length', val: routeData.requiredLength, unit: 'm' },
              ].map(({ label, val, unit }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-semibold text-gray-800">{val} <span className="text-xs font-normal">{unit}</span></p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Shipment type:</span>
              <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${isSplit ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                {isSplit ? 'Splittable (multi-truck)' : 'Single truck'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleFinalSubmit} disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? 'Creating…' : '✓ Create Shipment'}
            </button>
            <button onClick={() => setStep(2)} className="btn-secondary">← Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
