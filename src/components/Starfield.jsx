import { useState } from 'react';
import './Starfield.css';

export default function Starfield() {
  const [stars] = useState(() => {
    const result = [];
    for (let i = 0; i < 120; i++) {
      result.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() < 0.15 ? Math.random() * 2.5 + 1.5 : Math.random() * 1.5 + 0.5,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        brightness: Math.random() < 0.1 ? 1 : Math.random() * 0.6 + 0.2,
      });
    }
    return result;
  });

  return (
    <>
      <div className="bg-starfield" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className={`bg-star ${star.size > 2 ? 'bg-star--bright' : ''}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--twinkle-duration': `${star.duration}s`,
              '--twinkle-delay': `${star.delay}s`,
              opacity: star.brightness,
            }}
          />
        ))}
      </div>
      <div className="bg-nebula bg-nebula--1" />
      <div className="bg-nebula bg-nebula--2" />
    </>
  );
}
