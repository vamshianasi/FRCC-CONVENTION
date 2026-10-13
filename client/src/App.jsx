import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import ConventionBook from './pages/ConventionBook';
import ConventionDate from './pages/ConventionDate';
import ConventionDetails from './pages/ConventionDetails';
import ConventionPayment from './pages/ConventionPayment';
import ConventionConfirmation from './pages/ConventionConfirmation';
import MyBookings from './pages/MyBookings';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Notifications from './pages/Notifications';
import Reviews from './pages/Reviews';
import VenuePage from './pages/VenuePage';
import HallDetail from './pages/HallDetail';
import { getCurrentUser, handleRedirectEntry } from './services/auth';

// Simple wrapper that ensures auth is initialized before rendering protected routes
function RequireAuth({ children }) {
  const user = getCurrentUser();
  // If auth hasn't initialized yet, show nothing (handleRedirectEntry runs in background)
  // If no user after init, the auth service will redirect to main app
  if (!user) return null;
  return children;
}

export default function App() {
  // Initialize auth on app load
  handleRedirectEntry();

  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/convention/book" element={<RequireAuth><ConventionBook /></RequireAuth>} />
            <Route path="/convention/date" element={<RequireAuth><ConventionDate /></RequireAuth>} />
            <Route path="/convention/details" element={<RequireAuth><ConventionDetails /></RequireAuth>} />
            <Route path="/convention/payment" element={<RequireAuth><ConventionPayment /></RequireAuth>} />
            <Route path="/convention/confirmation" element={<RequireAuth><ConventionConfirmation /></RequireAuth>} />
            <Route path="/my-bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
            <Route path="/contact" element={<RequireAuth><Contact /></RequireAuth>} />
            <Route path="/gallery" element={<RequireAuth><Gallery /></RequireAuth>} />
            <Route path="/venue/:id" element={<RequireAuth><VenuePage /></RequireAuth>} />
            <Route path="/hall/:id" element={<RequireAuth><HallDetail /></RequireAuth>} />
            <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
            <Route path="/reviews" element={<RequireAuth><Reviews /></RequireAuth>} />
            {/* Catch-all: redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
}