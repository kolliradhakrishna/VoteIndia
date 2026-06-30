import { useEffect, useRef } from 'react';

const COLORS = [
  '#FF9933', '#f5c518', '#138808', '#ffffff',
  '#ff6b6b', '#4ecdc4', '#a29bfe', '#fd79a8',
];

const Confetti = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pieces = [];
    for (let i = 0; i < 120; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const left = Math.random() * 100;
      const duration = 2.5 + Math.random() * 3;
      const delay = Math.random() * 2;
      const width = 6 + Math.random() * 10;
      const height = 10 + Math.random() * 16;
      piece.style.cssText = `
        left: ${left}%;
        background: ${color};
        width: ${width}px;
        height: ${height}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: 0;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      container.appendChild(piece);
      pieces.push(piece);

      setTimeout(() => { piece.style.opacity = '1'; }, delay * 1000);
    }

    const cleanup = setTimeout(() => {
      pieces.forEach((p) => p.remove());
    }, 6000);

    return () => {
      clearTimeout(cleanup);
      pieces.forEach((p) => p.remove());
    };
  }, []);

  return <div className="confetti-container" ref={containerRef} aria-hidden="true" />;
};

export default Confetti;
