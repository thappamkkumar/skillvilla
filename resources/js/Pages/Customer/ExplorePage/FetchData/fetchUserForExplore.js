 import serverConnection from '../../../../CustomHook/serverConnection';  
 import { updateUserState } from '../../../../StoreWrapper/Slice/UserSlice';

const fetchUserForExplore = async(setLoading, cursor, authToken, dispatch, searchInput) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			let userData = { };
			let url = `/explore/user?cursor=${cursor}`;
			 if(searchInput != '')
			 {
				 userData.searchInput = searchInput;
			 }
			 
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			 
			//update the user state in redux.
			   // console.log(data);
				if(data != null && data.userList != null )
			 {
				 if(data.userList.data.length != 0 )
				 {
					dispatch(updateUserState({type : 'SetUsers', userList: data.userList.data}));  
				 }
					dispatch(updateUserState({type : 'SetCursor', cursor: data.userList.next_cursor})); 
					dispatch(updateUserState({type : 'SetHasMore', hasMore: data.userList.next_cursor != null})); 
				  
				}
			 
			 
		}
		catch(error)
		{
			 console.log(error);
			 setLoading(false);
		}
		finally{setLoading(false);}
}; 
export default fetchUserForExplore;