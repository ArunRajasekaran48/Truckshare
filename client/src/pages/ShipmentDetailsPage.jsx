import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getShipmentById } from '../features/shipmentSlice';
import Layout from '../components/common/Layout';

const ShipmentDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentShipment, loading, error } = useSelector((state) => state.shipment);

  useEffect(() => {
    dispatch(getShipmentById(id));
  }, [dispatch, id]);

  if (loading) return <Layout><p className="text-center">Loading...</p></Layout>;
  if (error) return <Layout><p className="text-red-500 text-center">Error: {error}</p></Layout>;
  if (!currentShipment) return <Layout><p className="text-center">Shipment not found</p></Layout>;

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Shipment Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p><strong>ID:</strong> {currentShipment.id}</p>
          <p><strong>Origin:</strong> {currentShipment.origin}</p>
          <p><strong>Destination:</strong> {currentShipment.destination}</p>
          <p><strong>Weight:</strong> {currentShipment.weight} kg</p>
          <p><strong>Volume:</strong> {currentShipment.volume} m³</p>
          <p><strong>Description:</strong> {currentShipment.description}</p>
          <p><strong>Status:</strong> {currentShipment.status}</p>
          <p><strong>Created At:</strong> {new Date(currentShipment.createdAt).toLocaleString()}</p>
          {/* Add more fields if available */}
        </div>
      </div>
    </Layout>
  );
};

export default ShipmentDetailsPage;