import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

export default function Navbar() {
  const user = getCurrentUser();

  return (
    <header className="bg-navy text-white sticky top-0 z-40 shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl text-gold font-bold">FRCC CONVENTIONS</Link>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/my-bookings" className="text-sm text-gold hover:underline">My Bookings</Link>
              <Link to="/contact" className="text-sm text-gold hover:underline">Support</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}