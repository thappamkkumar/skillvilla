 import serverConnection from '../../../../CustomHook/serverConnection';  
 import {updateFreelanceState} from '../../../../StoreWrapper/Slice/FreelanceSlice';

const fetchFreelanceForExplore = async(setLoading, cursor, authToken, dispatch, searchInput) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			
			let userData = {};
			let url = `/explore/freelance?cursor=${cursor}`;
			 //add if  search input  is not empty  
			 if(searchInput != '')
			 {
				 userData.searchInput = searchInput;
			 }
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			  // console.log(data);
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
export default fetchFreelanceForExplore;