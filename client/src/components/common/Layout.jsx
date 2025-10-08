import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, token } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">TruckShare</Link>
          <div className="flex items-center space-x-4">
            {token && currentUser?.role === 'TRUCK_OWNER' && (
              <>
                <Link to="/add-truck" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">
                  Add Truck
                </Link>
                <Link to="/truck-owner" className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-700">
                  My Trucks
                </Link>
              </>
            )}
            {token && currentUser?.role === 'BUSINESS_USER' && (
              <>
                <Link to="/create-shipment" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">
                  Create Shipment
                </Link>
                <Link to="/business-user" className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-700">
                  My Shipments
                </Link>
              </>
            )}
            {token ? (
              <>
                <span>Welcome, {currentUser?.userId}</span>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;