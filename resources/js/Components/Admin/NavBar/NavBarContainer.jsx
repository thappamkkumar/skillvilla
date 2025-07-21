 
import   { useState, useEffect, useCallback, memo } from 'react';
import { debounce } from 'lodash';

import LargeScreen from './LargeScreen'; 
import SmallScreen from './SmallScreen'; 
 
const NavBarContainer = () => {
	const [isSmallScreen, setIsSmallScreen] = useState(false); 
	
	const handlesmallScreen = useCallback(()=>{
			if(window.innerWidth < 576)
			{ 
				setIsSmallScreen(window.innerWidth < 576); // Update state based on screen width
			} 
		},[]);
	 useEffect(() => {
			 
		 	// Initial check for screen size
			handlesmallScreen();      
	 },[]);
	
	useEffect(() => {
        const handleResize = debounce(() => {
					 
					setIsSmallScreen(window.innerWidth < 576); // Update state based on screen width
				}, 200); // Adjust the debounce delay as needed


        // Add event listener to handle window resize
        window.addEventListener('resize', handleResize);
			
        // Cleanup by removing event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
						handleResize.cancel(); // Cancel any pending debounced calls
        };
    }, []);

	return (
	
		<>
		 
				{ isSmallScreen  ? (
						<SmallScreen   />
				) : (
						<LargeScreen  />
				)}
			 
		</>
		
	);
	
};

export default  memo(NavBarContainer);
