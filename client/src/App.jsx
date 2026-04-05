import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { UIContext } from './context/UIContext';

// Auth Pages
import { LandingAuthPage } from './pages/Auth/LandingAuthPage';

// Truck Owner Pages
import { TruckOwnerDashboard } from './pages/Truck/TruckOwnerDashboard';
import { DriverDashboard } from './pages/Driver/DriverDashboard';
import { AddTruckPage } from './pages/Truck/AddTruckPage';
import { EditTruckPage } from './pages/Truck/EditTruckPage';
import { TruckDetailsPage } from './pages/Truck/TruckDetailsPage';

// Business User Pages
import { BusinessDashboard } from './pages/Shipment/BusinessDashboard';
import { CreateShipmentPage } from './pages/Shipment/CreateShipmentPage';
import { ShipmentListPage } from './pages/Shipment/ShipmentListPage';
import { ShipmentDetailsPage } from './pages/Shipment/ShipmentDetailsPage';

// Booking Pages
import { MatchingPage } from './pages/Booking/MatchingPage';
import { BookingPage } from './pages/Booking/BookingPage';
import { BookingListPage } from './pages/Booking/BookingListPage';
import { PaymentPage } from './pages/Booking/PaymentPage';

// Tracking Pages
import { TrackingPage } from './pages/Tracking/TrackingPage';
import { TripStatusPage } from './pages/Tracking/TripStatusPage';
import { DeliveryPage } from './pages/Tracking/DeliveryPage';

// Common
import { ToastContainer } from './components/Common/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, isInitializing } = useContext(AuthContext);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RootRedirect() {
  const { isAuthenticated, user } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'TRUCK_OWNER') return <Navigate to="/dashboard/owner" replace />;
  if (user?.role === 'DRIVER') return <Navigate to="/dashboard/driver" replace />;
  return <Navigate to="/dashboard/business" replace />;
}

export default function App() {
  const { toasts } = useContext(UIContext);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LandingAuthPage initialMode="login" />} />
        <Route path="/register" element={<LandingAuthPage initialMode="register" />} />
        <Route path="/" element={<RootRedirect />} />

        {/* Truck Owner */}
        <Route
          path="/dashboard/owner"
          element={
            <ProtectedRoute allowedRoles={['TRUCK_OWNER']}>
              <TruckOwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trucks/add"
          element={
            <ProtectedRoute allowedRoles={['TRUCK_OWNER']}>
              <AddTruckPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trucks/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['TRUCK_OWNER']}>
              <EditTruckPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trucks/:id"
          element={
            <ProtectedRoute allowedRoles={['TRUCK_OWNER']}>
              <TruckDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Driver */}
        <Route
          path="/dashboard/driver"
          element={
            <ProtectedRoute allowedRoles={['DRIVER']}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Business User */}
        <Route
          path="/dashboard/business"
          element={
            <ProtectedRoute allowedRoles={['BUSINESS_USER']}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipments/create"
          element={
            <ProtectedRoute allowedRoles={['BUSINESS_USER']}>
              <CreateShipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipments"
          element={
            <ProtectedRoute allowedRoles={['BUSINESS_USER']}>
              <ShipmentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipments/:id"
          element={
            <ProtectedRoute allowedRoles={['BUSINESS_USER']}>
              <ShipmentDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipments/:shipmentId/match"
          element={
            <ProtectedRoute allowedRoles={['BUSINESS_USER']}>
              <MatchingPage />
            </ProtectedRoute>
          }
        />

        {/* Book truck — dedicated booking page */}
        <Route
          path="/shipments/:shipmentId/book"
          element={
            <ProtectedRoute allowedRoles={['BUSINESS_USER']}>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* ── Shared (all authenticated roles) ─────── */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId/payment"
          element={
            <ProtectedRoute allowedRoles={['TRUCK_OWNER']}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking/:bookingId"
          element={
            <ProtectedRoute>
              <TrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking/:bookingId/status"
          element={
            <ProtectedRoute>
              <TripStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracking/:bookingId/delivery"
          element={
            <ProtectedRoute>
              <DeliveryPage />
            </ProtectedRoute>
          }
        />

        {/* ── 404 ───────────────────────────────────── */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-4">
              <span className="text-7xl">🛣️</span>
              <h1 className="text-5xl font-bold text-slate-900">404</h1>
              <p className="text-slate-600 text-lg">This road doesn't lead anywhere.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          }
        />
      </Routes>

      <ToastContainer toasts={toasts} />
    </ErrorBoundary>
  );
}
