import {   memo, useRef, useEffect} from 'react'; 
import {  Outlet } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';  
import { debounce } from "lodash";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 

import CommunityHeader from "./../../../Components/Customer/CommunityList/CommunityHeader";
 import SuggestionCommunityList from "./CommunityChildPages/SuggestionCommunityList";
 
import {updateCommunityState as updateYourCommunityState} from '../../../StoreWrapper/Slice/YourCommunitySlice';

  
import useCommunityMemberCountWebsocket from '../../../Websockets/Community/useCommunityMemberCountWebsocket'; 
import useCommunityRequestCountWebsocket from '../../../Websockets/Community/useCommunityRequestCountWebsocket'; 
import useCommunityRemoveMemberWebsocket from '../../../Websockets/Community/useCommunityRemoveMemberWebsocket'; 
import useCommunityAcceptRequestWebsocket from '../../../Websockets/Community/useCommunityAcceptRequestWebsocket'; 
import useCommunityRequestRejectedWebsocket from '../../../Websockets/Community/useCommunityRequestRejectedWebsocket'; 
import useCommunityRequestCancelWebsocket from '../../../Websockets/Community/useCommunityRequestCancelWebsocket'; 
 
const CommunityPage = () => { 
	 
	const scrollRef = useRef(null);
	const timeoutId = useRef(null);
  
	const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
	const communityList = useSelector((state) => state.yourCommunityList); //selecting chat List from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
 
	
	// Call the  hook for websockets event listeners
	useCommunityMemberCountWebsocket(  
		logedUserData,  
		null
	);
	useCommunityRequestCountWebsocket(  
		logedUserData,  
		null
	);
	useCommunityRemoveMemberWebsocket(  
		logedUserData,  
		null
	);
 useCommunityAcceptRequestWebsocket(  
		logedUserData,  
		null
	);
 useCommunityRequestRejectedWebsocket(  
		logedUserData,  
		null
	);
 useCommunityRequestCancelWebsocket(  
		logedUserData,  
		null
	);
 
	
	// Set initial scroll position on mount
	useEffect(() => {
			if (scrollRef.current && communityList.scrollHeightPosition) {
			timeoutId.current = setTimeout(() => { 
					scrollRef.current.scrollTop = communityList.scrollHeightPosition;
				}, 0); // Adjust timeout as needed (100ms for example)
			}

			// Cleanup timeout on component unmount
			return () => {
				if (timeoutId.current) {
					clearTimeout(timeoutId.current);
				}
			};
    
  }, []);
	
	 
	
	
	 // Debounced scroll position update
  const handleScroll = debounce(() => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
        
      dispatch(updateYourCommunityState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    }
  }, 500);
	
	 useEffect(() => {
    const ref = scrollRef.current;
    if (ref) { 
      ref.addEventListener("scroll", handleScroll);
      return () => { 
        ref.removeEventListener("scroll", handleScroll);
        handleScroll.cancel();
      };
    }
  }, [ handleScroll]);
	
  return (
     <Row  ref={scrollRef} className="  p-0 m-0 main_container customListGroupContainer" >
        <Col sx={12} sm={12} md={7}   xxl={8}  className=" p-0 pe-sm-5	  m-0     " > 
					
					<CommunityHeader />
					<Outlet /> 
					
        </Col>
				
				 
				<Col sx={12} sm={12} md={5} xxl={4} className="  p-0 m-0    ">
           
						 <SuggestionCommunityList    />
				  
        </Col>
					 
        
      </Row>
     
  );
};

export default  memo(CommunityPage);
