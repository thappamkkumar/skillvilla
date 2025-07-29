import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

const useWindowHeight = (debounceDelay = 300) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleResize = useCallback(
    debounce(() => {
      setWindowHeight(window.innerHeight);
    }, debounceDelay),
    [debounceDelay]
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, [handleResize]);

  return windowHeight;
};

export default useWindowHeight;
