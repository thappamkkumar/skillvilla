import serverConnection from '../../../../CustomHook/serverConnection';

 
const handleRemoveMember = async ( memberId, setMembersCount, setRemoved, setSubmitting, setsubmitionMSG, setShowModel,  authToken) => {
    try {
        setSubmitting(true);
				
				const requestData = {
					memberId: memberId ,
				};
				 
				let data = await serverConnection('/community/remove-member', requestData, authToken);
  
        if (!data) return;

        if (data.status === true  ) { 
						
						setMembersCount(data.members_count);
						setRemoved(true);
            
						setsubmitionMSG("Member is removed successfully.");
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

export default handleRemoveMember;
