import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (currentUser?.role === 'TRUCK_OWNER') {
      navigate('/truck-owner');
    } else if (currentUser?.role === 'BUSINESS_USER') {
      navigate('/business-user');
    }
  }, [token, currentUser, navigate]);

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to TruckShare</h1>
        <p>Loading your dashboard...</p>
      </div>
    </Layout>
  );
};

export default DashboardPage;