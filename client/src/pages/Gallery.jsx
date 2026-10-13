import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GalleryGrid from '../components/GalleryGrid';
import { api } from '../services/api';

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const [city, setCity] = useState(params.get('city') || '');
  const [venue, setVenue] = useState(params.get('venue') || '');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api('/halls', { auth: false })
      .then(d => {
        let halls = d.halls;
        if (city) halls = halls.filter(h => h.city === city);
        if (venue) halls = halls.filter(h => h.venueId === venue);
        const imgs = [];
        for (const h of halls) {
          for (const [i, src] of h.images.entries()) {
            imgs.push({ src, alt: `${h.name} at ${h.venueName}, ${h.area}, ${h.city} – photo ${i + 1}`, hallId: h.id, venueId: h.venueId, venueName: h.venueName });
          }
        }
        setImages(imgs);
        // Reset venue filter if it no longer matches
        if (venue && !halls.some(h => h.venueId === venue)) { setVenue(''); }
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [city, venue]);

  // De-duplicate identical sources so the grid stays varied
  const unique = useMemo(() => {
    const seen = new Set();
    return images.filter(i => !seen.has(i.src) && seen.add(i.src));
  }, [images]);

  // Venue list for the chosen city
  const venueOptions = useMemo(() => {
    const seen = new Map();
    for (const img of unique) {
      if (!seen.has(img.venueId)) seen.set(img.venueId, img.venueName);
    }
    return [...seen.entries()].map(([id, name]) => ({ id, name }));
  }, [unique]);

  const setFilters = (c, v) => {
    setCity(c); setVenue(v);
    const next = new URLSearchParams(params);
    if (c) next.set('city', c); else next.delete('city');
    if (v) next.set('venue', v); else next.delete('venue');
    setParams(next, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-6">Gallery</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select className="border rounded p-2 w-full sm:w-56" value={city}
          onChange={e => setFilters(e.target.value, '')}>
          <option value="">All cities</option>
          <option value="HYD">Hyderabad</option>
          <option value="AMR">Amaravathi</option>
          <option value="VJA">Vijayawada</option>
        </select>
        <select className="border rounded p-2 w-full sm:w-56" value={venue} disabled={!city}
          onChange={e => setFilters(city, e.target.value)}>
          <option value="">All venues</option>
          {venueOptions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      {loading ? <p>Loading photos…</p> : unique.length === 0
        ? <p className="text-gray-500 bg-white rounded shadow p-6 text-center">No photos for this selection. Try another city or venue.</p>
        : <GalleryGrid images={unique} />}
    </div>
  );
}
