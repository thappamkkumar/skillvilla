 import serverConnection from '../../../../CustomHook/serverConnection';  
 import { updatePostState } from '../../../../StoreWrapper/Slice/TaggedSavedPostSlice';

const fetchPostForCommunity = async(setLoading, cursor, authToken, dispatch, communityId  ) =>
{
	 
	if(authToken == null) return;
	try
		{
			setLoading(true);
			let requestData = {communityId: communityId  };
			let url = `/get-community-post?cursor=${cursor}`;
			  
			 
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			 
			//update the post state in redux.
			   //console.log(data);
				if(data != null && data.postList != null )
			 {
				 if(data.postList.data.length != 0 )
				 {
					dispatch(updatePostState({type : 'SetPosts', postList: data.postList.data}));  
				 }
					dispatch(updatePostState({type : 'SetCursor', cursor: data.postList.next_cursor})); 
					dispatch(updatePostState({type : 'SetHasMore', hasMore: data.postList.next_cursor != null})); 
				  
				}
			 
			 
		}
		catch(error)
		{
			 //console.log(error);
			 setLoading(false);
		}
		finally{setLoading(false);}
}; 
export default fetchPostForCommunity;