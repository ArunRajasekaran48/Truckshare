import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getShipmentsByUser } from '../features/shipmentSlice';
import { getAllBookings } from '../features/bookingSlice';
import Layout from '../components/common/Layout';
import ShipmentCard from '../components/business/ShipmentCard';
import BookingCard from '../components/business/BookingCard';

const BusinessUserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shipments, loading: shipmentLoading, error: shipmentError } = useSelector((state) => state.shipment);
  const { bookings, loading: bookingLoading, error: bookingError } = useSelector((state) => state.booking);
  const [activeTab, setActiveTab] = useState('shipments');

  useEffect(() => {
    dispatch(getShipmentsByUser());
    dispatch(getAllBookings());
  }, [dispatch]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Business User Dashboard</h1>

        <div className="mb-4">
          <button
            onClick={() => setActiveTab('shipments')}
            className={`py-2 px-4 mr-2 ${activeTab === 'shipments' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          >
            My Shipments
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-4 ${activeTab === 'bookings' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          >
            My Bookings
          </button>
        </div>

        {activeTab === 'shipments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Shipments</h2>
              <button
                onClick={() => navigate('/create-shipment')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Create New Shipment
              </button>
            </div>
            {shipmentLoading && <p className="text-center">Loading shipments...</p>}
            {shipmentError && <p className="text-red-500 text-center">Error: {shipmentError}</p>}
            <div className="grid gap-4">
              {shipments.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
            </div>
            {!shipmentLoading && shipments.length === 0 && <p className="text-center">No shipments found. Create your first shipment!</p>}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
            {bookingLoading && <p className="text-center">Loading bookings...</p>}
            {bookingError && <p className="text-red-500 text-center">Error: {bookingError}</p>}
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
            {!bookingLoading && bookings.length === 0 && <p className="text-center">No bookings found.</p>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessUserDashboard;