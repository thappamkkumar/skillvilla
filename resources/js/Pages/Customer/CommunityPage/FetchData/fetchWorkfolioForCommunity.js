 import serverConnection from '../../../../CustomHook/serverConnection';  
 import { updateWorkfolioState } from '../../../../StoreWrapper/Slice/SavedWorkfolioSlice';

const fetchWorkfolioForCommunity = async(setLoading, cursor, authToken, dispatch,communityId) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			let requestData = {communityId: communityId };
			let url = `/get-community-workfolios?cursor=${cursor}`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			//update the post state in redux.
			 //console.log(data);
			if(data.status == true )
			{
				 if(data.workList.data.length != 0 )
				 {
					dispatch(updateWorkfolioState({type : 'SetWorkfolio', workfolioList: data.workList.data}));  
				 }
					dispatch(updateWorkfolioState({type : 'SetCursor', cursor: data.workList.next_cursor})); 
					dispatch(updateWorkfolioState({type : 'SetHasMore', hasMore: data.workList.next_cursor != null})); 
				 
			}			
			 
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
		finally{setLoading(false);}
}; 
export default fetchWorkfolioForCommunity;