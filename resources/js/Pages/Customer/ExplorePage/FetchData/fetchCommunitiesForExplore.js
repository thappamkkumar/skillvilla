 import serverConnection from '../../../../CustomHook/serverConnection';  
import {updateCommunityState} from '../../../../StoreWrapper/Slice/SuggestionCommunitySlice';
 
 
const fetchCommunitiesForExplore = async(setLoading, cursor, authToken, dispatch, searchInput) =>
{
	
	if(authToken == null) return;
	try
		{
			setLoading(true);
			let userData = {  }
			let url = `/explore/communities?cursor=${cursor}`;
			if(searchInput != '')
			 {
				 userData.searchInput = searchInput;
			 }
			 
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			 // console.log(data);
			if(data != null && data.status == true )
			{
					if(data.communityList.data.length != 0 )
				 {
						dispatch(updateCommunityState({type : 'SetCommunity', communityList: data.communityList.data})); 
					} 
				 
					dispatch(updateCommunityState({type : 'SetCursor', cursor: data.communityList.next_cursor})); 
					dispatch(updateCommunityState({type : 'SetHasMore', hasMore: data.communityList.next_cursor != null})); 
				  
			}
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
		finally{setLoading(false);}
}; 
export default fetchCommunitiesForExplore;