import React, { useState,  } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
 
// Components
import Header from '../Components/Customer/Header/Header';
import NavBarContainer from '../Components/Customer/NavBar/NavBarContainer';
//call components
import OutgoingCallModal from '../Components/Customer/Call/OutgoingCallModal';
import IncomingCallModal from '../Components/Customer/Call/IncomingCallModal'; 

// Hook for visited URL
import manageVisitedUrl from '../CustomHook/manageVisitedUrl';
import useWindowHeight  from '../CustomHook/useWindowHeight';

import useCommunityNewMessageWebsocket from '../Websockets/Community/useCommunityNewMessageWebsocket'; 
import useIncomingCallWebsocket from '../Websockets/Call/useIncomingCallWebsocket'; 
 
const CustomerLayoutPage = () => {
  const is_login = useSelector((state) => state.auth.is_login); // Check login status
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // Get logged-in user info
 
	
	const windowHeight = useWindowHeight();
	const navigate = useNavigate();


	 
	
	
	
	
	// Call the  hook for websockets event listeners for community message
	useCommunityNewMessageWebsocket();
	useIncomingCallWebsocket(logedUserData);
	
	 
/*
  useEffect(() => {
		
    if (!is_login) {
		  navigate('/login'); // Redirect to home if not logged in
    } else if (is_login && logedUserData.user_role === 'Admin') {
      navigate('/admin/dashboard'); // Redirect to admin dashboard if role is Admin
    }
  }, [is_login, logedUserData, navigate]);
*/

   

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
				<OutgoingCallModal  />
				{/*incoming call model*/}
				<IncomingCallModal  />
			
			</>
			
      
    </div>
  );
};

export default CustomerLayoutPage;
