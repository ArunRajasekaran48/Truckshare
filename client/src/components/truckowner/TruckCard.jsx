import React from 'react';
import { useNavigate } from 'react-router-dom';

const TruckCard = ({ truck, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/update-truck/${truck.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this truck?')) {
      onDelete(truck.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{truck.model} - {truck.capacityWeight} tons</h2>
      <p>License Plate: {truck.licensePlate}</p>
      <p>Status: {truck.status}</p>
      <p>From: {truck.fromLocation} To: {truck.toLocation}</p>
      <div className="mt-2">
        <button
          onClick={handleEdit}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TruckCard;