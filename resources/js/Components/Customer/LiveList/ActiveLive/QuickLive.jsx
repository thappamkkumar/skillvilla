
import {useEffect, useCallback, useState, memo} from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import Spinner from "react-bootstrap/Spinner"; 

import LoadMoreButton from '../../../../Components/Common/LoadMoreButton';

const QuickLive = () =>{
	const authToken = useSelector((state) => state.auth.token); 
	const liveList = useSelector((state) => state.activeLiveList); 
	
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch(); 
	
	
	const apiCall = useCallback(async()=>{ 
		if(authToken == null)return;
		try
		{
			setLoading(true);
			
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
	 
	
	
	return(
		<div>
			
			
			
			
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
				<div className="text-center py-4">
					<Spinner animation="border" size="md" />
				</div>
			)}
			
			

		 { liveList.quickLiveHasMore && !loading &&
				(
					<LoadMoreButton apiCall={apiCall}  loading={loading} />
				)
			}	
			
							
		</div>
	);
};

export default memo(QuickLive);