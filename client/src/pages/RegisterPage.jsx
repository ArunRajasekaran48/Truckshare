import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    phone: '',
    role: 'BUSINESS_USER',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <Layout>
      <RegisterForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </Layout>
  );
};

export default RegisterPage;