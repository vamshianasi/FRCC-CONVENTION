import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

export default function Profile() {
  const user = getCurrentUser();
  if (!user) return null;
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-6">Profile / Dashboard</h1>
      <div className="bg-white rounded shadow p-6">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email / Mobile:</span> {user.email} / {user.mobile}</p>
        <div className="flex gap-3 mt-6">
          <Link to="/my-bookings" className="bg-navy text-gold rounded px-4 py-2">My Bookings</Link>
          <Link to="/contact" className="border border-navy text-navy rounded px-4 py-2">Support</Link>
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-4">Payment history is available inside each record under My Bookings → View Details.</p>
    </div>
  );
}