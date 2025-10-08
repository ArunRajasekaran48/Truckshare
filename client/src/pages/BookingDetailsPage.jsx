import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getBookingById } from '../features/bookingSlice';
import Layout from '../components/common/Layout';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBooking, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getBookingById(id));
  }, [dispatch, id]);

  if (loading) return <Layout><p className="text-center">Loading...</p></Layout>;
  if (error) return <Layout><p className="text-red-500 text-center">Error: {error}</p></Layout>;
  if (!currentBooking) return <Layout><p className="text-center">Booking not found</p></Layout>;

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p><strong>ID:</strong> {currentBooking.id}</p>
          <p><strong>Shipment ID:</strong> {currentBooking.shipmentId}</p>
          <p><strong>Truck ID:</strong> {currentBooking.truckId}</p>
          <p><strong>Status:</strong> {currentBooking.status}</p>
          <p><strong>Total Cost:</strong> ${currentBooking.totalCost}</p>
          <p><strong>Created At:</strong> {new Date(currentBooking.createdAt).toLocaleString()}</p>
          {/* Add more fields if available */}
        </div>
      </div>
    </Layout>
  );
};

export default BookingDetailsPage;