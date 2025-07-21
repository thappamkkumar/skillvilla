	import serverConnection from '../../../../CustomHook/serverConnection';
import { updateCommunityRequestState } from '../../../../StoreWrapper/Slice/CommunityRequestSlice';
import {updateCommunityDetailState} from '../../../../StoreWrapper/Slice/CommunityDetailSlice';
import {updateCommunityState as updateYourCommunityState} from '../../../../StoreWrapper/Slice/YourCommunitySlice';

const updateRequestStatus = async ( requestId, communityId, status, setSubmitting,setsubmitionMSG, setShowModel, dispatch, authToken, setRemoved  ) => {
    try {
        setSubmitting(true);
				
				const requestData = {
					requestId: requestId ,
					status: status  
				};
				 
				let data = await serverConnection('/community/request-status-updation', requestData, authToken);
  
        if (!data) return;

        if (data.status === true  ) { 
				
            dispatch(updateCommunityRequestState({ type: 'updateRequestStatus', requestStatusData: requestData}));
						
						if(data.members_count != null && status =='accepted'   )
						{
							//update member count of community detail state
							dispatch(updateCommunityDetailState({
								type: 'memberCountUpdate', 
								membersCount: Math.max(0, data.members_count)
							}));
							//update member count of your community  state
							dispatch(updateYourCommunityState({
									type: 'updateMembersCount',
									updatedMembersCountData: { communityId: communityId, membersCount: Math.max(0, data.members_count) }
							}));
							 
						}
						
						
						if(data.requests_count != null   )
						{  
							if( status =='accepted' || status == 'canceled' )
							{
								dispatch(updateCommunityDetailState({
									type: 'requestCountUpdate', 
									requestCount: Math.max(0, data.requests_count)
								}));
								
								//set state true to remove request from list and show message 
								setRemoved(true)
								
							}
							 
							
							dispatch(updateYourCommunityState({
									type: 'updatePendingRequestCount',
									updatedPendingRequestCountData: { 
										communityId: communityId,
										requestCount: Math.max(0, data.requests_count) 
									}
							}));
						}
						setsubmitionMSG(data.message);
						setShowModel(true);
             
        } else {
            setsubmitionMSG(data.message);
            setShowModel(true);
        } 
    } catch (error) {
        setsubmitionMSG('An error occurred. Please try again.');
        setShowModel(true);
    } finally {
        setSubmitting(false);
    }
};

export default updateRequestStatus;
