import React from 'react';

const TruckForm = ({ formData, handleChange, handleSubmit, buttonText, error, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">License Plate</label>
        <input
          type="text"
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Model</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Capacity Weight (kg)</label>
        <input
          type="number"
          name="capacityWeight"
          value={formData.capacityWeight}
          onChange={handleChange}
          required
          min="0"
          step="0.1"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Capacity Volume (m³)</label>
        <input
          type="number"
          name="capacityVolume"
          value={formData.capacityVolume}
          onChange={handleChange}
          required
          min="0"
          step="0.1"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">From Location</label>
        <input
          type="text"
          name="fromLocation"
          value={formData.fromLocation}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">To Location</label>
        <input
          type="text"
          name="toLocation"
          value={formData.toLocation}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : buttonText}
      </button>
    </form>
  );
};

export default TruckForm;