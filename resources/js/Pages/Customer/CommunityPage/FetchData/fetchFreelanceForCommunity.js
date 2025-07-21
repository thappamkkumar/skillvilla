 import serverConnection from '../../../../CustomHook/serverConnection';  
 import {updateFreelanceState} from '../../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice';

const fetchFreelanceForCommunity = async(setLoading, cursor, authToken, dispatch, communityId) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			
			let requestData = {communityId: communityId };
			let url = `/get-community-freelances?cursor=${cursor}`;
			  
			//call the function fetch  data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			   //console.log(data);
			if(data != null && data.status == true )
			{
				if(data.freelanceList.data.length != 0 )
				 {
					dispatch(updateFreelanceState({type : 'SetFreelance', freelanceList: data.freelanceList.data}));
					} 
					dispatch(updateFreelanceState({type : 'SetCursor', cursor: data.freelanceList.next_cursor})); 
					dispatch(updateFreelanceState({type : 'SetHasMore', hasMore: data.freelanceList.next_cursor != null})); 
				  
			}
		}
		catch(error)
		{
			 //console.log(error);
			setLoading(false);
		}
		finally{setLoading(false);}
}; 
export default fetchFreelanceForCommunity;