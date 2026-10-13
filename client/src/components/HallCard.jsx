import { useState, useEffect, useRef } from 'react';
import { inr } from '../utils/format';

const FALLBACK = '/images/placeholder.svg';

// Build webp/jpg pair for a given local image path ending in .jpg
export function imagePair(src) {
  if (!src || !src.startsWith('/images/')) return { src, webp: null };
  const webp = src.replace(/\.jpg$/, '.webp');
  return { src, webp };
}

export function SmartImage({ src, alt, className = '', imgClassName = '', sizes = '(max-width: 768px) 100vw, 33vw', eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const { src: jpg, webp } = imagePair(src);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    // If image is already cached and complete, mark as loaded immediately
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    // Otherwise wait for load
    const onLoad = () => setLoaded(true);
    const onError = () => { setError(true); setLoaded(true); };
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {error && <div className="absolute inset-0 bg-stone-100 flex items-center justify-center" aria-hidden="true">
        <span className="text-xs text-stone-500">Photo coming soon</span>
      </div>}
      <picture>
        {webp && !error && <source srcSet={webp} type="image/webp" />}
        <img
          ref={imgRef}
          src={error ? FALLBACK : jpg}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded && !error ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      </picture>
    </div>
  );
}

export default function HallCard({ hall, onSelect, selected, actionLabel = 'Select', eager = false }) {
  const [idx, setIdx] = useState(0);
  // Use images array directly (already full URLs from API)
  const imgs = hall.images && hall.images.length ? hall.images : [FALLBACK];
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden border-2 transition ${selected ? 'border-gold' : 'border-transparent'}`}>
      <div className="relative">
        <SmartImage
          src={imgs[idx]}
          alt={`${hall.name} – photo ${idx + 1} of ${imgs.length}`}
          className="h-56"
          eager={eager}
        />
        {imgs.length > 1 && (
          <div className="flex justify-center gap-1 py-1">
            {imgs.map((im, i) => (
              <button key={im} onClick={() => setIdx(i)} aria-label={`Show photo ${i + 1} of ${hall.name}`}
                className={`w-2.5 h-2.5 rounded-full ${i === idx ? 'bg-gold' : 'bg-navy/40 hover:bg-navy/60'}`} />
            ))}
          </div>
        )}
        <span className="absolute top-2 left-2 bg-gold text-navy text-xs font-semibold rounded px-2 py-0.5">
          {hall.type === 'NON_AC' ? 'Non-AC' : hall.type === 'BOARD_ROOM' ? 'Board Room' : 'AC'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{hall.name}</h3>
        <p className="text-sm text-gray-600">{hall.areaName || hall.area} • {hall.cityName || hall.city || ''} • Capacity: {hall.capacity} guests</p>
        <p className="mt-1 font-semibold text-navy">
          {hall.displayPricePerHour || inr(hall.pricePerHour)} <span className="text-gray-500 font-normal">• {hall.displayPricePerDay || inr(hall.pricePerDay)}</span>
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {hall.amenities.slice(0, 4).map(a => <span key={a} className="text-xs bg-navy-100 text-navy rounded-full px-2 py-0.5">{a}</span>)}
        </div>
        {onSelect && (
          <button onClick={() => onSelect(hall)} className={`mt-3 w-full rounded py-2 font-semibold ${selected ? 'bg-gold text-navy' : 'bg-navy text-gold hover:bg-navy-800'}`}>
            {selected ? '✓ Selected' : actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}