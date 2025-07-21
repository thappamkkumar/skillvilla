 
import   {useEffect, useState, useCallback  }  from 'react';  
import {  useSelector, useDispatch } from 'react-redux'; 
import Spinner from 'react-bootstrap/Spinner';    

import UserTable from '../../../Components/Admin/User/UserTable'; 
import PaginationControls from '../../../Components/Common/PaginationControls'; 
 import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import serverConnection from '../../../CustomHook/serverConnection'; 
import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 

 



const UserPage = () => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	   
	const userList = useSelector((state) => state.AdminDataList); //selecting post List from store
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
				if(data.userList.data.length != 0 )
				{
					//	setUserList(data.userList.data);
					dispatch(updateListState({type : 'SetData', listData: data.userList.data})); 
				} 
				
				dispatch(updateListState({
					type : 'SetNextPageUrl',
					nextPageUrl: data.userList.next_cursor != null ? `/admin/get-user-list?cursor=${data.userList.next_cursor}` : null
					})); 
				dispatch(updateListState({
					type : 'SetPrevPageUrl',
					prevPageUrl: data.userList.prev_cursor != null ? `/admin/get-user-list?cursor=${data.userList.prev_cursor}` : null
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
		if(userList.data.length == 0)
		{
			apiCall('/admin/get-user-list'); 
		}
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [ authToken, userList.data.length]);
	
	 
       
 	  
 	 
	
	 
	 
	return ( 
		<>
			<PageSeo 
					title="Manage Users | Admin | SkillVilla"
					description="Browse and manage all registered users in the SkillVilla platform."
					keywords="admin user list, SkillVilla admin, manage users, user overview"
				/>

			<div className="pb-5 px-1 px-md-2  px-lg-3 px-xl-4 px-xxl-5 main_container">
				 
				<h2> Users </h2>
				 
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
						<UserTable  users={userList.data}  />
						<PaginationControls 
							nextPageUrl={userList.nextPageUrl}
							prevPageUrl={userList.prevPageUrl} 
							onPageChange={apiCall}
							/>
					</>
				}
				</div>
				
			</div>
		</>
	);
};

export default UserPage;
