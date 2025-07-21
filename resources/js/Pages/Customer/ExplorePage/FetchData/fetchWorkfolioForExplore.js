 import serverConnection from '../../../../CustomHook/serverConnection';  
 import { updateWorkfolioState } from '../../../../StoreWrapper/Slice/WorkfolioSlice';

const fetchWorkfolioForExplore = async(setLoading, cursor, authToken, dispatch, searchInput) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			let userData = { };
			let url = `/explore/workfolio?cursor=${cursor}`;
			 if(searchInput != '')
			 {
				 userData.searchInput = searchInput;
			 }
			 
			//call the function fetcg post data fron server
			let data = await serverConnection(url,userData, authToken);
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
export default fetchWorkfolioForExplore;