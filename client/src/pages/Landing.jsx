import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80')" }}
    >
      <div className="absolute inset-0 bg-navy-900/70 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl text-gold font-bold drop-shadow">FRCC CONVENTIONS</h1>
        <p className="text-gray-200 mt-4 text-lg md:text-xl">Book exceptional convention and function halls in minutes.</p>
        <Link to="/convention/book" className="inline-block mt-8 bg-gold text-navy font-bold px-8 py-3 rounded shadow hover:bg-gold-light">
          Book Convention Hall
        </Link>
      </div>
    </section>
  );
}