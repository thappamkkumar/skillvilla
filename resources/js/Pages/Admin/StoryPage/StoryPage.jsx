 
import   {useEffect, useState, useCallback  }  from 'react';  
import {  useSelector, useDispatch } from 'react-redux'; 
import Spinner from 'react-bootstrap/Spinner';    

import StoryTable from '../../../Components/Admin/Story/StoryTable'; 
import PaginationControls from '../../../Components/Common/PaginationControls'; 
 
import serverConnection from '../../../CustomHook/serverConnection'; 
import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 



const StoryPage = () => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 
	const list = useSelector((state) => state.AdminDataList); //selecting post List from store
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	  
	//function for fetching data
	const apiCall = useCallback(async(pageUrl)=>{ 
		try
		{
			if(authToken == null || pageUrl == null){return;}
			setLoading(true); 
			  
			 
			//call the function fetch  data fron server
			let data = await serverConnection(pageUrl, {}, authToken);
			 
		  //console.log(data);
			if(data != null && data.status == true )
			{
				if(data.storyList.data.length != 0 )
				{
					//	setUserList(data.userList.data);
					dispatch(updateListState({type : 'SetData', listData: data.storyList.data})); 
				} 
				
				dispatch(updateListState({
					type : 'SetNextPageUrl',
					nextPageUrl: data.storyList.next_cursor != null ? `/admin/get-story-list?cursor=${data.storyList.next_cursor}` : null
					})); 
				dispatch(updateListState({
					type : 'SetPrevPageUrl',
					prevPageUrl: data.storyList.prev_cursor != null ? `/admin/get-story-list?cursor=${data.storyList.prev_cursor}` : null
					}));
				 
				 
				 
			}
			 
		}
		catch(error)
		{
			 //console.log(error);
			
		}
		finally
		{
			setLoading(false);
		}
			
	},[  authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(list.data.length == 0)
		{
			apiCall('/admin/get-story-list'); 
		}
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [ authToken, list.data.length]);
	
	 
       
 	  
 	 
	
	 
	 
	return ( 
		<>
			<PageSeo 
				title="Manage Stories | Admin | SkillVilla"
				description="Browse and manage all user-submitted stories from the SkillVilla admin dashboard."
				keywords="admin stories, SkillVilla admin, manage stories, user content"
			/>

			<div className="pb-5 px-1 px-md-2  px-lg-3 px-xl-4 px-xxl-5 main_container">
				 
					<h2> Stories </h2>
				 
				{
					loading && 
					<div className="w-100 text-center">
						<Spinner size="md" />
					</div>
				}
				<div className="pb-4"  >
				{
					!loading &&  
					<>
						<StoryTable  stories={list.data}  /> 
						<PaginationControls 
							nextPageUrl={list.nextPageUrl}
							prevPageUrl={list.prevPageUrl} 
							onPageChange={apiCall}
							/>
					</>
				}
				</div>
				
			</div>
		</>
	);



};

export default StoryPage;
