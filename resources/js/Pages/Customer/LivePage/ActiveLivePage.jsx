  
import {   memo, useRef, useState, useCallback, useEffect} from 'react'; 
import { useSelector, useDispatch } from 'react-redux';  
import { debounce } from "lodash";
import Row from 'react-bootstrap/Row' ;
import Col from 'react-bootstrap/Col' ;


import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer';
import MainPageHeader from "./../../../Components/Customer/LiveList/MainPageHeader";
import QuickLive from "./../../../Components/Customer/LiveType/QuickLive";
import ProfessionalLive from "./../../../Components/Customer/LiveType/ProfessionalLive";

import serverConnection from '../../../CustomHook/serverConnection';

import { updateActiveLiveState } from '../../../StoreWrapper/Slice/ActiveLiveSlice';
 
//live stream custom hook for websockets
import useLiveStreamStartWebsocket from '../../../Websockets/LiveStream/useLiveStreamStartWebsocket';



const ActiveLivePage = () => {  
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const liveList = useSelector((state) => state.activeLiveList);
	const [loading, setLoading] = useState(false);
	 
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
  // Call the websocket hook
  useLiveStreamStartWebsocket(logedUserData);
	
	
	
	//function for fetching data (professional live streams)
	const apiCall = useCallback(async()=>{ 
		console.log('fetch professional streams');
	
	
		if(authToken == null) return;
		try
		{
			setLoading(true);
			//call the function fetcg post data fron server
			 
			  
				  
		}
		catch(error)
		{
			console.log(error);
			
		}
		finally
		{
			setLoading(false);
		}
			
	},[dispatch, liveList]); 

	useEffect(() => { 
		 
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(liveList.professionalLiveList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [liveList.professionalLiveList.length]);
	 
	
	
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateActiveLiveState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop})); 
    
  }, [dispatch]);
	 
	return (
     <InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={liveList?.professionalLiveHasMore || false}
				loading={loading}
				initialScrollPosition={liveList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
				style="pb-5  pt-0  main_container"
			> 
         
				 {/* MainPageHeader  is comment due to interview reason. when working again un-comment it. it work well. and also in create page uncomment proffesional live and in queck live return only button*/}
				 {/*<MainPageHeader />*/}
				 
				 
				 
				 
				<Row className="m-0 flex-row-reverse p-0  ">
					<Col sm={12} xl={3} className="  bg-light py-2 py-xl-4">
						<h3 className="fw-bold  ">Quick Lives</h3>
						<QuickLive />
					</Col>
					
					<Col sm={12} xl={9} className="px-2 px-md-4 py-4">
						{/*<h3 className="fw-bold  ">Professional Lives</h3>
						<ProfessionalLive />*/}
					</Col>
				</Row>
        
      </InfiniteScrollContainer>
     
  );
};

export default  memo(ActiveLivePage);
