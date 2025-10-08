import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTruck } from '../features/truckSlice';
import Layout from '../components/common/Layout';
import TruckForm from '../components/truckowner/TruckForm';

const AddTruckPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    licensePlate: '',
    model: '',
    capacityWeight: '',
    capacityVolume: '',
    fromLocation: '',
    toLocation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(addTruck({ ...formData, status: 'AVAILABLE' })).unwrap();
      navigate('/truck-owner');
    } catch (err) {
      setError(err.message || 'Failed to add truck');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Add New Truck</h1>
        <TruckForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          buttonText="Add Truck"
          error={error}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default AddTruckPage;