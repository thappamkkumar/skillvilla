import React, { useState, useCallback, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';

// Components
import Header from '../Components/Customer/Header/Header';
import NavBarContainer from '../Components/Customer/NavBar/NavBarContainer';
//call components
import OutgoingCallModal from '../Components/Customer/Call/OutgoingCallModal';

// Hook for visited URL
import manageVisitedUrl from '../CustomHook/manageVisitedUrl';

import useCommunityNewMessageWebsocket from '../Websockets/Community/useCommunityNewMessageWebsocket'; 
 
const CustomerLayoutPage = () => {
  const is_login = useSelector((state) => state.auth.is_login); // Check login status
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // Get logged-in user info
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const navigate = useNavigate();


	
	//states for call
	const [showCallModal, setShowCallModal] = useState(true);
	
	
	
	
	// Call the  hook for websockets event listeners for community message
	useCommunityNewMessageWebsocket();
	
	 
/*
  useEffect(() => {
		
    if (!is_login) {
		  navigate('/login'); // Redirect to home if not logged in
    } else if (is_login && logedUserData.user_role === 'Admin') {
      navigate('/admin/dashboard'); // Redirect to admin dashboard if role is Admin
    }
  }, [is_login, logedUserData, navigate]);
*/

  // Debounced resize handler
  const handleResize = useCallback(
    debounce(() => {
			 
      setWindowHeight(window.innerHeight);
    }, 300), // Adjust the debounce delay as needed
    []
  );
// Handle window resize to update height dynamically
 
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel(); // Cancel pending debounced calls on unmount
    };
  }, [handleResize]);

  return (
    <div className="  layout-container" style={{ height: windowHeight }}>
      <NavBarContainer className="sidebar" />
      <div className="main-content">
        <Header />
        <div className="content" >
          <Outlet /> {/* Render nested routes */}
        </div>
      </div>
			
			<>
				{/*outgoing call model*/}
				<OutgoingCallModal
					show={showCallModal}
					onHide={() => setShowCallModal(false)}
					receiver={{name:"Jane Smith", image:'/images/profile_icon.png'}}
				/>
			
			</>
			
      
    </div>
  );
};

export default CustomerLayoutPage;
