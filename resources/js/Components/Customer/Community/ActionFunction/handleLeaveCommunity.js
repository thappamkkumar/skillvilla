import serverConnection from '../../../../CustomHook/serverConnection';
import { updateCommunityState as updateSuggestionCommunityState } from '../../../../StoreWrapper/Slice/SuggestionCommunitySlice';
import { updateCommunityState as updateJoinedCommunityState } from '../../../../StoreWrapper/Slice/JoinedCommunitySlice';
import {updateCommunityDetailState} from '../../../../StoreWrapper/Slice/CommunityDetailSlice';
 
const handleLeaveCommunity = async (    community, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken, communityId = null) => {
    try {
        setSubmitting(true);
        let data = await serverConnection('/communities/leave', { id: community.id }, authToken);

        if (!data) return;

        if (data.status === true) {
            
						//remove community from joined community state
            dispatch(updateJoinedCommunityState({ type: 'removeCommunity', cummunityId: community.id }));

						//update has_joined in suggestion community state
            dispatch(updateSuggestionCommunityState({
                type: 'updateHasJoinedStatus',
                updatedHasJoinedData: { communityId: community.id, hasJoined: false }
            }));

						//update member count  in suggestion community state
            dispatch(updateSuggestionCommunityState(
							{
                type: 'updateMembersCount',
                updatedMembersCountData: { communityId: community.id, membersCount: Math.max(0, data.members_count ) 
							}
            }));
						
						//if community detail is opened or communityId is not  null
						if(communityId != null  )
						{
							//update has joined in community detal state 
							dispatch(updateCommunityDetailState(
							{
								type: 'updateHasJoined',   hasJoined: false  
							}));
							
							//update member count in community detal state
							dispatch(updateCommunityDetailState({
								type: 'memberCountUpdate', 
								membersCount : data.members_count 
							}));
							 
						}
						
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

export default handleLeaveCommunity;
