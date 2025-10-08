import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTrucksByOwner, deleteTruck } from '../features/truckSlice';
import Layout from '../components/common/Layout';
import TruckCard from '../components/truckowner/TruckCard';

const TruckOwnerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ownerTrucks, loading, error } = useSelector((state) => state.truck);

  useEffect(() => {
    dispatch(fetchTrucksByOwner());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteTruck(id));
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Truck Owner Dashboard</h1>
          <button
            onClick={() => navigate('/add-truck')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Truck
          </button>
        </div>
        {loading && <p className="text-center">Loading trucks...</p>}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}
        <div className="grid gap-4">
          {ownerTrucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} onDelete={handleDelete} />
          ))}
        </div>
        {!loading && ownerTrucks.length === 0 && <p className="text-center">No trucks found. Add your first truck!</p>}
      </div>
    </Layout>
  );
};

export default TruckOwnerDashboard;