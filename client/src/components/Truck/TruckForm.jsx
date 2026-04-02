import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { truckSchema } from '@/utils/validators';
import { INDIAN_CITIES, TRUCK_STATUS } from '@/utils/constants';

export function TruckForm({ defaultValues, onSubmit, onCancel, isLoading }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(truckSchema),
    defaultValues: defaultValues || {
      status: 'AVAILABLE',
      points: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'points' });

  const field = (label, name, type = 'text', extra = {}) => (
    <div>
      <label className="label">{label}</label>
      <input
        {...register(name)}
        type={type}
        className="input-field"
        {...extra}
      />
      {errors[name] && <p className="error-text">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('License Plate', 'licensePlate', 'text', { placeholder: 'MH01AB1234' })}
        {field('Vehicle Model', 'model', 'text', { placeholder: 'Tata 407' })}
      </div>

      {/* Route */}
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

      {/* Boarding / dropping stops */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-sm font-semibold text-gray-700 px-2">Boarding &amp; dropping stops</legend>
        <p className="text-xs text-gray-500 mt-1 mb-3">
          Optional. If you add stops, shippers must pick boarding and dropping points when booking this truck.
        </p>
        <div className="space-y-4">
          {fields.map((row, index) => (
            <div
              key={row.id}
              className="relative flex flex-col gap-3 border border-gray-200 rounded-lg p-4 bg-gray-50/50"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-xs font-medium text-red-600 hover:text-red-700 hover:underline px-2 py-1"
              >
                Remove
              </button>

              <input type="hidden" {...register(`points.${index}.id`)} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="label text-xs">Type</label>
                  <select {...register(`points.${index}.type`)} className="input-field text-sm">
                    <option value="BOARDING">Boarding</option>
                    <option value="DROPPING">Dropping</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Stop name</label>
                  <input {...register(`points.${index}.name`)} className="input-field text-sm" placeholder="e.g. Koyambedu Bus Stand" />
                  {errors.points?.[index]?.name && (
                    <p className="error-text text-xs">{errors.points[index].name.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs">Address (optional)</label>
                  <input {...register(`points.${index}.address`)} className="input-field text-sm" placeholder="Street, area" />
                </div>
                <div>
                  <label className="label text-xs">Time (optional)</label>
                  <input {...register(`points.${index}.scheduledTime`)} className="input-field text-sm" placeholder="10:00 AM" />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ type: 'BOARDING', name: '', address: '', scheduledTime: '' })}
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            + Add stop
          </button>
        </div>
      </fieldset>

      {/* Capacity */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-sm font-semibold text-gray-700 px-2">Total Capacity</legend>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {field('Weight (kg)', 'capacityWeight', 'number', { min: 0, step: 'any', placeholder: '5000' })}
          {field('Volume (m³)', 'capacityVolume', 'number', { min: 0, step: 'any', placeholder: '25' })}
          {field('Length (m)', 'capacityLength', 'number', { min: 0, step: 'any', placeholder: '10' })}
        </div>
      </fieldset>

      {/* Available capacity (defaults = total on create) */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-sm font-semibold text-gray-700 px-2">Available Capacity</legend>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {field('Weight (kg)', 'availableWeight', 'number', { min: 0, step: 'any' })}
          {field('Volume (m³)', 'availableVolume', 'number', { min: 0, step: 'any' })}
          {field('Length (m)', 'availableLength', 'number', { min: 0, step: 'any' })}
        </div>
      </fieldset>

      {/* Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Price per kg (₹)', 'pricePerKg', 'number', { min: 0, step: 'any' })}
        {field('Price per meter (₹)', 'pricePerLength', 'number', { min: 0, step: 'any' })}
      </div>

      {/* Status */}
      <div>
        <label className="label">Status</label>
        <select {...register('status')} className="input-field">
          {Object.values(TRUCK_STATUS).map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? 'Saving…' : defaultValues ? 'Update Truck' : 'Add Truck'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
}
