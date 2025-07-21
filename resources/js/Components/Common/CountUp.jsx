import React, { useEffect, useState } from 'react';

const CountUp = ({ end, duration = 2, prefix = '', suffix = '', separator = ',' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const fps = 60;
    const totalFrames = duration * fps;
    const increment = end / totalFrames;

    let frame = 0;

    const animate = () => {
      frame++;
      const current = Math.min(end, Math.floor(increment * frame));

      setCount(current);

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animate();
  }, [end, duration]);

  // Format number with separator
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  return <span>{prefix}{formatNumber(count)}{suffix}</span>;
};

export default CountUp;
