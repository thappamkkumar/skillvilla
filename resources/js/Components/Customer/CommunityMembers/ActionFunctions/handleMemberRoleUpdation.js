import serverConnection from '../../../../CustomHook/serverConnection';
import { updateCommunityMemberState } from '../../../../StoreWrapper/Slice/CommunityMemberSlice';
 
const handleMemberRoleUpdation = async ( memberId, role, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken) => {
    try {
        setSubmitting(true);
				
				const requestData = {
					memberId: memberId ,
					role: role  
				};
				 
				let data = await serverConnection('/community/role-updation', requestData, authToken);
 
        if (!data) return;

        if (data.status === true  ) { 
				
            dispatch(updateCommunityMemberState({ type: 'roleUpdation', roleData: requestData}));
						setsubmitionMSG("Role is updated successfully.");
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

export default handleMemberRoleUpdation;
