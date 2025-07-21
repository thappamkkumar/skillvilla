 import serverConnection from '../../../../CustomHook/serverConnection'; 
import {updateCommunityDetailState} from '../../../../StoreWrapper/Slice/CommunityDetailSlice';

const fetchCommunityDetail = async( authToken, dispatch, communityId,setDetailLoading, setFormData = ()=>{} ) =>
{
	
	if(authToken == null) return;
	try
		{
			setDetailLoading(true);
			let requestData = {communityId: communityId  };
			let url = '/get-community-detail';
			  
			 
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			  //  console.log(data);
				if(data   && data.communityDetail != null )
			 {
				  
					dispatch(updateCommunityDetailState({type : 'SetCommunityDetail', communityDetail: data.communityDetail}));  
				 setFormData(data.communityDetail);
				  
				}
			 
			 
		}
		catch(error)
		{
			// console.log(error);
			 
		} 
		finally{
			setDetailLoading(false);
		}
}; 
export default fetchCommunityDetail;