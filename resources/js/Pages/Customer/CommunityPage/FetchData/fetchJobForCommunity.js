 import serverConnection from '../../../../CustomHook/serverConnection';  
 import {updateJobState} from '../../../../StoreWrapper/Slice/AppliedSavedJobSlice';
 
const fetchJobForCommunity = async(setLoading, cursor, authToken, dispatch, communityId ) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			
			let requestData = {communityId: communityId };
			let url = `/get-community-jobs?cursor=${cursor}`; 
			  
			  
			
			//call the function fetch  data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
		 //console.log(data);
			if(data != null && data.status == true )
			{
					 
					if(data.jobList.data.length != 0 )
					{
						dispatch(updateJobState({type : 'SetJob', jobList: data.jobList.data}));
					} 
					dispatch(updateJobState({type : 'SetCursor', cursor: data.jobList.next_cursor})); 
					dispatch(updateJobState({type : 'SetHasMore', hasMore: data.jobList.next_cursor != null})); 
				  
			}
		}
		catch(error)
		{
			 //console.log(error);
			setLoading(false);
		}
		finally{setLoading(false);}
}; 
export default fetchJobForCommunity;