import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, readOnly = false, size = 20 }) {
  const [hovered, setHovered] = useState(0);

  const display = readOnly ? value : (hovered || value);

  return (
    <div className="flex gap-1" aria-label={`Calificación: ${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onChange?.(star)}
          className={`transition-all duration-150 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= display
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600 fill-transparent'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
