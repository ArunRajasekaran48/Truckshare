import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShipmentCard = ({ shipment }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/shipment/${shipment.id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Shipment {shipment.id}</h3>
      <p>From: {shipment.origin} To: {shipment.destination}</p>
      <p>Weight: {shipment.weight}kg, Volume: {shipment.volume}m³</p>
      <p>Status: {shipment.status}</p>
      <div className="mt-2">
        <button
          onClick={handleViewDetails}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ShipmentCard;