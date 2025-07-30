// src/Components/UnlockAudio.jsx
import { useEffect } from 'react';

const UnlockAudio = () => {
  useEffect(() => {
    const unlock = () => {
      const audio = new Audio("/audio/silence.mp3");
      audio.play().catch(() => {}); // Attempt unlock silently
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  return null;
};

export default UnlockAudio;
