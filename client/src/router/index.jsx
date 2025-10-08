import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TruckOwnerDashboard from '../pages/TruckOwnerDashboard';
import BusinessUserDashboard from '../pages/BusinessUserDashboard';
import AddTruckPage from '../pages/AddTruckPage';
import UpdateTruckPage from '../pages/UpdateTruckPage';
import CreateShipmentPage from '../pages/CreateShipmentPage';
import ShipmentDetailsPage from '../pages/ShipmentDetailsPage';
import BookingListPage from '../pages/BookingListPage';
import BookingDetailsPage from '../pages/BookingDetailsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/truck-owner',
    element: <TruckOwnerDashboard />,
  },
  {
    path: '/business-user',
    element: <BusinessUserDashboard />,
  },
  {
    path: '/add-truck',
    element: <AddTruckPage />,
  },
  {
    path: '/update-truck/:id',
    element: <UpdateTruckPage />,
  },
  {
    path: '/create-shipment',
    element: <CreateShipmentPage />,
  },
  {
    path: '/shipment/:id',
    element: <ShipmentDetailsPage />,
  },
  {
    path: '/bookings',
    element: <BookingListPage />,
  },
  {
    path: '/booking/:id',
    element: <BookingDetailsPage />,
  },
]);

export default router;