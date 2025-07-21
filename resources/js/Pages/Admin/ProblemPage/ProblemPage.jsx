 
import {useEffect, useState, useCallback} from 'react';  
import {useSelector, useDispatch } from 'react-redux'; 
import Spinner from 'react-bootstrap/Spinner';    

import ProblemTable from '../../../Components/Admin/Problem/ProblemTable'; 
import PaginationControls from '../../../Components/Common/PaginationControls'; 
 
import serverConnection from '../../../CustomHook/serverConnection'; 
import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 



const ProblemPage = () => { 
	
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
				if(data.problemList.data.length != 0 )
				{ 
					dispatch(updateListState({type : 'SetData', listData: data.problemList.data})); 
				} 
				
				dispatch(updateListState({
					type : 'SetNextPageUrl',
					nextPageUrl: data.problemList.next_cursor != null ? `/admin/get-problem-list?cursor=${data.problemList.next_cursor}` : null
					})); 
				dispatch(updateListState({
					type : 'SetPrevPageUrl',
					prevPageUrl: data.problemList.prev_cursor != null ? `/admin/get-problem-list?cursor=${data.problemList.prev_cursor}` : null
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
			apiCall('/admin/get-problem-list'); 
		}
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [ authToken, list.data.length]);
	
	 
       
 	  
 	 
	
	 
	 
	return ( 
		<>
			<PageSeo 
				title="Manage Problems | Admin | SkillVilla"
				description="Browse and manage all submitted problems from users in the SkillVilla admin dashboard."
				keywords="admin problems, manage problems, SkillVilla admin, problem moderation"
			/>

			<div className="pb-5 px-1 px-md-2  px-lg-3 px-xl-4 px-xxl-5 main_container">
					 
					<h2> Problems </h2>
					 
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
							<ProblemTable problems={list.data} />  
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

export default ProblemPage;
