 
import { Outlet,   } from 'react-router-dom';
 
// Components
import Header from '../Components/Customer/Header/Header';
import NavBarContainer from '../Components/Customer/NavBar/NavBarContainer';
import CallManager from '../Components/Layout/Customer/CallManager'
import LiveStreamManager from '../Components/Layout/Customer/LiveStreamManager'

//import manageVisitedUrl from '../CustomHook/manageVisitedUrl';
import useWindowHeight  from '../CustomHook/useWindowHeight';

import useCommunityNewMessageWebsocket from '../Websockets/Community/useCommunityNewMessageWebsocket'; 
  
 
const CustomerLayoutPage = () => {
   
	const windowHeight = useWindowHeight();
  
	// Call the  hook for websockets event listeners for community message
	useCommunityNewMessageWebsocket();
	
	
	 
 

   

  return (
    <div className="  layout-container" style={{ height: windowHeight }}>
      <NavBarContainer className="sidebar" />
      <div className="main-content">
        <Header />
        <div className="content" >
          <Outlet /> {/* Render nested routes */}
        </div>
      </div>
			
			 
			<CallManager  /> 
			<LiveStreamManager  /> 
      
    </div>
  );
};

export default CustomerLayoutPage;
