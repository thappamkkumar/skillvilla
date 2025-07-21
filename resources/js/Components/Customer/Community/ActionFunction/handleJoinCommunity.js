import serverConnection from '../../../../CustomHook/serverConnection';
import { updateCommunityState as updateSuggestionCommunityState } from '../../../../StoreWrapper/Slice/SuggestionCommunitySlice';
import { updateCommunityState as updateJoinedCommunityState } from '../../../../StoreWrapper/Slice/JoinedCommunitySlice';
import {updateCommunityDetailState} from '../../../../StoreWrapper/Slice/CommunityDetailSlice';
 
const handleJoinCommunity = async ( community, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken, communityId = null) => {
    try {
        setSubmitting(true);
        let data = await serverConnection('/communities/join', { id: community.id }, authToken);
  
        if (!data) return;

        if (data.status === true && data.communityData != null) {
            
						//add community in joined community state
            dispatch(updateJoinedCommunityState({ type: 'addNewCommunity', communityData: data.communityData }));

						//update has_joined in suggestion community state
            dispatch(updateSuggestionCommunityState({
                type: 'updateHasJoinedStatus',
                updatedHasJoinedData: { communityId: community.id, hasJoined: true }
            }));

						//update member count  in suggestion community state
            dispatch(updateSuggestionCommunityState({
                type: 'updateMembersCount',
                updatedMembersCountData: 
								{ 
									communityId: community.id, 
									membersCount: data.communityData.members_count 
								}
            }));
						
						//if community detail is opened or communityId is not  null
						if(communityId != null  )
						{
							//update has joined in community detal state 
							dispatch(updateCommunityDetailState(
							{
								type: 'updateHasJoined',   hasJoined: true  
							}));
							
							//update member count in community detal state
							dispatch(updateCommunityDetailState({
								type: 'memberCountUpdate', 
								membersCount : data.communityData.members_count 
							}));

						}
        } else {
            setsubmitionMSG(data.message);
            setShowModel(true);
        }
    } catch (error) {
			console.log(error);
        setsubmitionMSG('An error occurred. Please try again.');
        setShowModel(true);
    } finally {
        setSubmitting(false);
    }
};

export default handleJoinCommunity;
