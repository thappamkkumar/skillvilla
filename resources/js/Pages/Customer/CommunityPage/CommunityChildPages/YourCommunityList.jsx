import {memo, useState, useEffect, useCallback} from 'react'; 
import { useSelector, useDispatch } from 'react-redux';  
import { useNavigate } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button'; 
import Spinner from "react-bootstrap/Spinner";
import { BsPlus   } from "react-icons/bs";    
 
import LoadMoreButton from '../../../../Components/Common/LoadMoreButton';
import CommunityList from '../../../../Components/Customer/CommunityList/CommunityList'; 
; 
import PageSeo from '../../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import {updateCommunityState as updateYourCommunityState} from '../../../../StoreWrapper/Slice/YourCommunitySlice';

//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../../CustomHook/serverConnection';

const YourCommunityList = ( ) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const communityList = useSelector((state) => state.yourCommunityList); //selecting chat List from store
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
  const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
	const [loading, setLoading] = useState(false); 
  
 
  
	
		
	//function use to handle navigation to add new community
	const handleNavigateToCreateCommunity= useCallback(()=>{
		// manageVisitedUrl(`/communities/create-new`, 'append'); 
		 navigate('/communities/create-new');
		 
	}, []);
	
	// Handle api call for fetching logged user created communities
	const apiCall = useCallback(async()=>{ 
		if(authToken == null)return;
		try
		{ 
			setLoading(true);
			const url = `/get-user-communities?cursor=${communityList.cursor}`;
			//call the function fetcg post data fron server
			let data = await serverConnection(url, { }, authToken);
			//update the post state in redux.
			   //console.log(data);
			 if(data.status == true && data.communityList.data.length != 0 )
			 {  
					dispatch(updateYourCommunityState({type : 'SetCommunity', communityList: data.communityList.data}));  
					dispatch(updateYourCommunityState({type : 'SetCursor', cursor: data.communityList.next_cursor})); 
					dispatch(updateYourCommunityState({type : 'SetHasMore', hasMore: data.communityList.next_cursor != null})); 
				 
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
					title="Communities | SkillVilla"
					description="Discover and join communities on SkillVilla."
					keywords="communities, SkillVilla, join, connect"
				/>

				 <div className="pb-5">
				  
							
							<CommunityList communityList={communityList.communityList}   />
							
							{
								communityList.communityList.length <= 0 && !loading &&
								(
									<h6 className="py-4  text-center text-muted">
											You haven't created any communities yet.
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

export default  memo(YourCommunityList);
