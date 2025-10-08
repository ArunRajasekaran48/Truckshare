import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <Layout>
      <LoginForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </Layout>
  );
};

export default LoginPage;