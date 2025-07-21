import serverConnection from '../../../../CustomHook/serverConnection';
import { updateCommunityState as updateSuggestionCommunityState } from '../../../../StoreWrapper/Slice/SuggestionCommunitySlice';
import {updateCommunityDetailState} from '../../../../StoreWrapper/Slice/CommunityDetailSlice';
 
const handleRequestToJoin = async (   community, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken, communityId = null) => {
    try {
        setSubmitting(true);
        let data = await serverConnection('/communities/request', { id: community.id }, authToken);

        if (!data) return;

        if (data.status) {
            if (data.canceledRequest) {
                // Cancel request and remove from state
                dispatch(updateSuggestionCommunityState({
                    type: 'cancelRequest',
                    cancelRequestCommunityId: community.id
                }));
								if(communityId != null  )
								{
									dispatch(updateCommunityDetailState({ type: 'cancelRequest'  })); 
								}
            } else if (data.newRequest && Object.keys(data.newRequest).length > 0) {
                // Add new request data
                dispatch(updateSuggestionCommunityState({
                    type: 'addNewRequest',
                    addNewRequestData: data.newRequest
                }));
								if(communityId != null  )
								{
									dispatch(updateCommunityDetailState({ 
														type: 'addNewRequest',
														newRequest: data.newRequest 
									})); 
								}
            } else {
                setsubmitionMSG(data.message);
                setShowModel(true);
            }
        } else {
					//console.log(data.message);
            setsubmitionMSG(data.message || 'An error occurred. Please try again.');
            setShowModel(true);
        }
    } catch (error) {
			//console.log(error);
        setsubmitionMSG('An error occurred. Please try again.');
        setShowModel(true);
    } finally {
        setSubmitting(false);
    }
};

export default handleRequestToJoin;
