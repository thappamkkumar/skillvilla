import serverConnection from '../../../../CustomHook/serverConnection';
import { updateCommunityMemberState } from '../../../../StoreWrapper/Slice/CommunityMemberSlice';
 
const handleContentShareAccessUpdation = async ( memberId, access, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken) => {
    try {
        setSubmitting(true);
				
				const requestData = {
					memberId: memberId ,
					access: access  
				};
				 
				let data = await serverConnection('/community/content-share-access-updation', requestData, authToken);
  
        if (!data) return;

        if (data.status === true  ) { 
				
            dispatch(updateCommunityMemberState({ type: 'contentShareAccessUpdation', contentShareAccess: requestData}));
						
						setsubmitionMSG("Sharing access is updated successfully.");
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

export default handleContentShareAccessUpdation;
