import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTruckById, updateTruck } from '../features/truckSlice';
import Layout from '../components/common/Layout';
import TruckForm from '../components/truckowner/TruckForm';

const UpdateTruckPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTruck, loading, error } = useSelector((state) => state.truck);
  const [formData, setFormData] = useState({
    licensePlate: '',
    model: '',
    capacityWeight: '',
    capacityVolume: '',
    fromLocation: '',
    toLocation: '',
  });

  useEffect(() => {
    dispatch(fetchTruckById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTruck) {
      setFormData({
        licensePlate: currentTruck.licensePlate || '',
        model: currentTruck.model || '',
        capacityWeight: currentTruck.capacityWeight || '',
        capacityVolume: currentTruck.capacityVolume || '',
        fromLocation: currentTruck.fromLocation || '',
        toLocation: currentTruck.toLocation || '',
      });
    }
  }, [currentTruck]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTruck({ id, truckData: formData })).unwrap();
      navigate('/truck-owner');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Layout><p className="text-center">Loading...</p></Layout>;
  if (error) return <Layout><p className="text-red-500 text-center">Error: {error}</p></Layout>;

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Update Truck</h1>
        <TruckForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          buttonText="Update Truck"
          error={error}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default UpdateTruckPage;