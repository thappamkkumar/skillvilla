 import serverConnection from '../../../../CustomHook/serverConnection';  
 import {updateProblemState} from '../../../../StoreWrapper/Slice/ProblemSlice';
 
const fetchProblemForExplore = async(setLoading, cursor, authToken, dispatch, searchInput) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			let userData = {  }
			let url = `/explore/problem?cursor=${cursor}`;
			if(searchInput != '')
			 {
				 userData.searchInput = searchInput;
			 }
			 
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
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
export default fetchProblemForExplore;