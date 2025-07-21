import {memo, useState, useEffect, useCallback} from 'react'; 
import { useSelector, useDispatch } from 'react-redux';  
import Spinner from "react-bootstrap/Spinner"; 
 
import LoadMoreButton from '../../../../Components/Common/LoadMoreButton';
import CommunityList from '../../../../Components/Customer/CommunityList/CommunityList'; 
 

import {updateCommunityState as updateSuggestionCommunityState} from '../../../../StoreWrapper/Slice/SuggestionCommunitySlice';
 
import serverConnection from '../../../../CustomHook/serverConnection';

const SuggestionCommunityList = ( ) => {
  const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const communityList = useSelector((state) => state.suggestionCommunityList); //selecting chat List from store
	const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
	const [loading, setLoading] = useState(false); 
  
	 // Handle api call for fetching   communities suggestions
	const apiCall = useCallback(async()=>{ 
		if(authToken == null)return;
		try
		{ 
			setLoading(true);
			const url = `/get-suggestion-communities?cursor=${communityList.cursor}`;
			//call the function fetcg post data fron server
			let data = await serverConnection(url, { }, authToken);
			//update the post state in redux.
			  //console.log(data);
			 if(data.status == true && data.communityList.data.length != 0 )
			 {  
					dispatch(updateSuggestionCommunityState({type : 'SetCommunity', communityList: data.communityList.data}));  
					dispatch(updateSuggestionCommunityState({type : 'SetCursor', cursor: data.communityList.next_cursor})); 
					dispatch(updateSuggestionCommunityState({type : 'SetHasMore', hasMore: data.communityList.next_cursor != null})); 
				 
			 }
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[dispatch, authToken, communityList.cursor]); 

	 
		
		
		
	useEffect(() => {  
		  
		// Create a cancel token source
		let source = axios.CancelToken.source();
		if(communityList.communityList.length == 0)
		{
			apiCall(); 
		}
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, communityList.communityList.length]);
	 
	
  return (
      
				 <div className="pb-5 pt-2"   >
							<div className="   px-3 pb-1   border-bottom border-3">
								<h4>Suggestions</h4>
								 
							</div>
							
							<CommunityList communityList={communityList.communityList}  />
							 
						 
						{
								communityList.communityList.length <= 0 && !loading &&
								(
									<h6 className="py-4  text-center text-muted">
											No suggestions available.
										</h6>
								)
								
								
							}
							
							{	
								loading && (
								<div className="text-center py-4">
									<Spinner animation="border" size="md" />
								</div>
							)}
							
							
			
						 { communityList.hasMore && !loading &&
								(
									<LoadMoreButton apiCall={apiCall}  loading={loading} />
								)
							}	
						 
						 
				</div>
		
     
  );
};

export default  memo(SuggestionCommunityList);
