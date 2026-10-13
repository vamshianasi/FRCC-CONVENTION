import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import HallCard from '../components/HallCard';

export default function Home() {
  const [halls, setHalls] = useState([]);
  useEffect(() => { api('/halls', { auth: false }).then(d => setHalls(d.halls)).catch(() => {}); }, []);

  return (
    <div>
      <section className="bg-navy text-white py-14 text-center px-4">
        <h1 className="text-4xl text-gold">FRCC CONVENTIONS</h1>
        <p className="mt-2 text-gray-300">Book exceptional convention and function halls in minutes.</p>
        <Link to="/convention/book" className="inline-block mt-6 bg-gold text-navy font-bold px-8 py-3 rounded hover:bg-gold-light">Book Now</Link>
      </section>

      <section id="about" className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl mb-3">About FRCC CONVENTIONS</h2>
        <p className="text-gray-600">We host weddings, conferences, corporate meets and celebrations of every scale — with AC halls, non-AC venues and executive board rooms, all at one venue. Our team handles staging, lighting, seating and décor so your event runs flawlessly.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-3xl mb-6">Featured Halls</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {halls.slice(0, 3).map(h => <HallCard key={h.id} hall={h} />)}
        </div>
      </section>
    </div>
  );
}