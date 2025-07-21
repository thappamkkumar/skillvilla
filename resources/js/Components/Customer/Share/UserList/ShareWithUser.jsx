 
import {memo, useState,  useCallback  } from 'react';
import {useSelector, useDispatch } from 'react-redux';   
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { BsShare,  } from "react-icons/bs";   
 

import MessageAlert from '../../../MessageAlert';

import { updateShareStatsState } from '../../../../StoreWrapper/Slice/ShareStatsSlice';
   
import serverConnection from '../../../../CustomHook/serverConnection';

const ShareWithUser = ({selectedUsers, setSelectedUsers}) => { 
	const authToken = useSelector((state) => state.auth.token); //selecting token from 
	
	const shareStats = useSelector((state) => state.shareStats); 
	const [sharing, setSharing] = useState(false);
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	 
	
	const dispatch = useDispatch();
	
	 
	const ShareWithUser = useCallback(async()=>{
		try
		{
			if(authToken == null || selectedUsers == null || selectedUsers.length <= 0 || shareStats.selectedId == null || shareStats.selectedFeature == "")
			{ 
				return;
			}
			
			setSharing(true);
			
			const requestData = {
				selectedUsers : selectedUsers,
				shareId : shareStats.selectedId,
				shareType : shareStats.selectedFeature
			}
			const url = '/share-with-users';
			
			let result = await serverConnection(url, requestData, authToken);
			// console.log(result);
			if(result != null && result.status == true)
			{
				 
				setsubmitionMSG("Shared successfully.");
				setShowModel(true);
			}
			else
			{ 
				setsubmitionMSG( `Failed to share ${ shareStats.selectedFeature} with selected users, try again.`);
				setShowModel(true);
			}
			 
			
		}
		catch(e)
		{

			// console.log(e);
			setsubmitionMSG( 'Oops! Something went wrong.');
			setShowModel(true); 
		}
		finally
		{
			setSelectedUsers([]);
			setSharing(false);
		}
		
	}, [authToken, selectedUsers]); 
	
	return ( 
		 
			<div  className="w-100  " >
				<Button 
					variant="danger" 
					id="shareWithUSerSeparatly" 
					title="Share with user" 
					className=" w-100 fw-bold" onClick={ShareWithUser}
					disabled={sharing || selectedUsers == null || selectedUsers.length <= 0}
				>
					{
						sharing ?
							<Spinner size="sm" />
						:
						<>	
							<BsShare className=" fs-6 me-2 " style={{ strokeWidth: '1',  }} /> 		Share	
						</>
					}
			
				</Button>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
			</div>
		 		
		 
	);
	
};

export default memo(ShareWithUser);
