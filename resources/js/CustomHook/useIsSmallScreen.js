import { useState, useEffect } from 'react';
import _ from 'lodash';  

const useIsSmallScreen = (breakpoint = 768) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < breakpoint);


	 const handleResize = _.debounce(() => {  
      setIsSmallScreen(window.innerWidth < breakpoint);
    }, 1000);

  useEffect(() => {
   
    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
			//handleResize.cancel();
    };
  }, [breakpoint]);

  return isSmallScreen;
};

export default useIsSmallScreen;
