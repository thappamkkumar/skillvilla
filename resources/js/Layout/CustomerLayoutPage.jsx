import   { useState, useEffect,   } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
 
// Components
import Header from '../Components/Customer/Header/Header';
import NavBarContainer from '../Components/Customer/NavBar/NavBarContainer';
//call components
import OutgoingCallModal from '../Components/Customer/Call/OutgoingCallModal';
import IncomingCallModal from '../Components/Customer/Call/IncomingCallModal'; 
import AudioCallModal from '../Components/Customer/Call/AudioCallModal'; 
import VideoCallModal from '../Components/Customer/Call/VideoCallModal'; 

// Hook for visited URL
import serverConnection from '../CustomHook/serverConnection';
import manageVisitedUrl from '../CustomHook/manageVisitedUrl';
import useWindowHeight  from '../CustomHook/useWindowHeight';

import useCommunityNewMessageWebsocket from '../Websockets/Community/useCommunityNewMessageWebsocket'; 
import useIncomingCallWebsocket from '../Websockets/Call/useIncomingCallWebsocket'; 
import useCallEndWebsocket from '../Websockets/Call/useCallEndWebsocket'; 
import useCallAcceptWebsocket from '../Websockets/Call/useCallAcceptWebsocket'; 
import useCallHoldWebsocket from '../Websockets/Call/useCallHoldWebsocket'; 
 
 
 import { updateChatCallState } from '../StoreWrapper/Slice/ChatCallSlice';
 
 
 
const CustomerLayoutPage = () => {
  //const is_login = useSelector((state) => state.auth.is_login); // Check login status
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // Get logged-in user info
 	const authToken = useSelector((state) => state.auth.token); 
 
	
	const windowHeight = useWindowHeight();
	const navigate = useNavigate();
	const dispatch = useDispatch();


	 
	
	
	
	
	// Call the  hook for websockets event listeners for community message
	useCommunityNewMessageWebsocket();
	useIncomingCallWebsocket(logedUserData);
	useCallEndWebsocket(logedUserData);
	useCallAcceptWebsocket(logedUserData);
	useCallHoldWebsocket(logedUserData);
	
	useEffect(() => {
  if (!authToken) return; // wait until token refresh finishes

	const restoreCallState = async()=> {
    try {
      const res = await serverConnection('/call/active', {}, authToken);

      if (res?.status && res.data) 
			{
				
				const callData = {
					
				};
        dispatch(updateChatCallState({ type: 'setActiveCallData', callData: callData }));
				alert('if call status is initiated show calling ui of caller and incoming call ui for reciver. if call status is accepted then show message like you are already in call and btn for join or cancel.');
      } else {
        dispatch(updateChatCallState({ type: 'refresh' }));
      }
    } catch (err) {
      console.error('Error restoring call state:', err);
    }
  }

  restoreCallState();
}, [authToken, dispatch]);

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
				{/*Audio In-call model*/}
				<AudioCallModal  />
				{/*Video In-call model*/}
				<VideoCallModal  />
			
			</>
			
      
    </div>
  );
};

export default CustomerLayoutPage;
