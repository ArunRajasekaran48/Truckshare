import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/booking/${booking.id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Booking {booking.id}</h3>
      <p>Shipment ID: {booking.shipmentId}</p>
      <p>Truck ID: {booking.truckId}</p>
      <p>Status: {booking.status}</p>
      <p>Total Cost: ${booking.totalCost}</p>
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

export default BookingCard;