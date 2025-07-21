import {memo, useState, useEffect, useCallback} from 'react'; 
import { useSelector, useDispatch } from 'react-redux';  
import Spinner from "react-bootstrap/Spinner"; 
 
import LoadMoreButton from '../../../../Components/Common/LoadMoreButton';
import CommunityList from '../../../../Components/Customer/CommunityList/CommunityList'; 
import PageSeo from '../../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import {updateCommunityState as updateJoinedCommunityState} from '../../../../StoreWrapper/Slice/JoinedCommunitySlice';
 
import serverConnection from '../../../../CustomHook/serverConnection';

const JoinedCommunityList = ( ) => {
	
  const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const communityList = useSelector((state) => state.joinedCommunityList); //selecting chat List from store
	const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
	const [loading, setLoading] = useState(false); 
  
 
  
	
		  
   // Handle api call for fetching   communities joined by logged user
	const apiCall = useCallback(async()=>{ 
		if(authToken == null)return;
		try
		{ 
			setLoading(true);
			const url = `/get-joined-communities?cursor=${communityList.cursor}`;
			//call the function fetchpost data fron server
			let data = await serverConnection(url, { }, authToken);
			//update the post state in redux.
			 //console.log(data);
			 if(data.status == true && data.communityList.data.length != 0 )
			 {  
					dispatch(updateJoinedCommunityState({type : 'SetCommunity', communityList: data.communityList.data}));  
					dispatch(updateJoinedCommunityState({type : 'SetCursor', cursor: data.communityList.next_cursor})); 
					dispatch(updateJoinedCommunityState({type : 'SetHasMore', hasMore: data.communityList.next_cursor != null})); 
				 
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
      <>
				<PageSeo 
					title="Joined Communities | SkillVilla"
					description="View the communities you have joined on SkillVilla."
					keywords="joined communities, SkillVilla, membership, community engagement"
				/>

				 <div className="pb-5">
							 
							<CommunityList  
								communityList={communityList.communityList} 
  
							/>
							 
						 
						{
								communityList.communityList.length <= 0 && !loading &&
								(
									<h6 className="py-4  text-center text-muted">
											No joined communities found. Explore and join one!
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
		</>
     
  );
};

export default  memo(JoinedCommunityList);
