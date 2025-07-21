 import serverConnection from '../../../../CustomHook/serverConnection';  
 import {updateProblemState} from '../../../../StoreWrapper/Slice/SavedProblemSlice';
 
const fetchProblemForCommunity = async(setLoading, cursor, authToken, dispatch, communityId) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			let requestData = {communityId: communityId }
			let url = `/get-community-problems?cursor=${cursor}`;
			 
			 
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url, requestData, authToken);
			 
			// console.log(data);
			if(data != null && data.status == true )
			{
				if(data.problemList.data.length != 0 )
				 {
					dispatch(updateProblemState({type : 'SetProblem', problemList: data.problemList.data}));
					} 
					dispatch(updateProblemState({type : 'SetCursor', cursor: data.problemList.next_cursor})); 
					dispatch(updateProblemState({type : 'SetHasMore', hasMore: data.problemList.next_cursor != null})); 
				  
			}
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
		finally{setLoading(false);}
}; 
export default fetchProblemForCommunity;