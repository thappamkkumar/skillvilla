
import {useEffect, useCallback, useState, memo,useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import Spinner from "react-bootstrap/Spinner"; 
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

import QuickLiveList from '../../../Components/Customer/LiveList/QuickLiveList';
import LoadMoreButton from '../../../Components/Common/LoadMoreButton';

import {updateActiveLiveState} from '../../../StoreWrapper/Slice/ActiveLiveSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';

const QuickLive = () =>{
	const authToken = useSelector((state) => state.auth.token); 
	const liveList = useSelector((state) => state.activeLiveList); 
	
	const [loading, setLoading] = useState(false);
  const horizontalScrollRef = useRef(null);

	const dispatch = useDispatch(); 
	
	
	const apiCall = useCallback(async()=>{ 
		if(authToken == null)return;
		try
		{
			setLoading(true);
			const url = `/get-following-active-quick-live-streams?cursor=${liveList.quickLiveCursor}`;
			//call the function fetcg post data fron server
			let data = await serverConnection(url, { }, authToken);
			//console.log(data);
			
			if(data?.status)
			{
				dispatch(updateActiveLiveState({type : 'SetQuickLive', quickLiveList: data.lives.data}));  
				dispatch(updateActiveLiveState({type : 'SetQuickLiveCursor', quickLiveCursor: data.lives.next_cursor}));  
				dispatch(updateActiveLiveState({type : 'SetQuickLiveHasMore', quickLiveHasMore: data.lives.next_cursor != null}));  
			}
			
		}
		catch(error)
		{
				console.log(error);
		}
		finally
		{
			setLoading(false);
		}
			
	},[dispatch, authToken, liveList.quickLiveCursor]); 

	
	useEffect(() => {  
		  
		// Create a cancel token source
		let source = axios.CancelToken.source();
		if(liveList.quickLiveList.length == 0)
		{
			apiCall(); 
		}
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, liveList.quickLiveList.length]);
	 
	
  // SCROLL BUTTONS
  const scrollLeft = () => {
    horizontalScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    horizontalScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };
	
	return(
		
    <div className="position-relative  w-100">
		
      {/* LEFT scroll button on mobile only */}
      <button
        className="btn btn-secondary shadow-sm position-absolute start-0 bottom-1 d-xl-none h-75"
        
        onClick={scrollLeft}
      >
        <BsChevronCompactLeft size={20} />
      </button>

      {/* RIGHT scroll button on mobile only */}
      <button
        className="btn btn-secondary shadow-sm position-absolute end-0 bottom-1  d-xl-none h-75" 
        onClick={scrollRight}
      >
        <BsChevronCompactRight size={20} />
      </button>
			
			<div 
        ref={horizontalScrollRef} className="d-flex d-xl-block align-items-center  pb-1 pb-xl-0 px-5 px-xl-0  overflow-x-auto overflow-y-hidden   ">
				
				
				<QuickLiveList liveList={liveList.quickLiveList} />
				
				{
					liveList.quickLiveList.length <= 0 && !loading &&
					(
						<h6 className="py-2    text-muted">
								No Live available.
							</h6>
					)
					
					
				}
								
				
				
				{	
					loading && (
					<div className="text-center px-3 px-xl-0 pt-xl-4 ">
						<Spinner animation="border" size="md" />
					</div>
				)}
				
				

			 { liveList.quickLiveHasMore && !loading &&
					(
						<div className="flex-shrink-0 ps-2 ps-xl-0 pe-3 pe-xl-0 ">
							<LoadMoreButton apiCall={apiCall} loading={loading} />
						</div>
					)
				}	
			
							
			</div>
		</div>
	);
};

export default memo(QuickLive);