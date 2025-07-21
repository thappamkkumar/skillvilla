import { memo, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'; 
import {  BsBookmarkPlus, BsBookmark  } from 'react-icons/bs';

import {updateFreelanceState} from '../../../StoreWrapper/Slice/FreelanceSlice';
import {updateFreelanceState as updateUserFreelanceState} from '../../../StoreWrapper/Slice/UserFreelanceSlice';
import {updateFreelanceState as updateAppliedSavedFreelanceState} from '../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice'; 
import { updateFeedState } from '../../../StoreWrapper/Slice/FeedSlice';
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';


const FreelanceActions = ( 
{ 
		freelance_id,
		is_expired,
    already_bid,  
    has_saved,  
		updateFreelanceDetailSave=()=>{},
}
) => {
const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	
		
	//function use to call api to save and unsave job
	const handleJobSave = useCallback(async()=>{
		
		try
		{ 
			if(freelance_id == null ){return;}
			let data = {
				freelance_id:freelance_id,  
			}; 
			let result = await serverConnection(`/save-freelance-work`, data, authToken);
			//console.log(result);
			if(result.status == true)
			{
				const savedFreelanceData = {
					'has_saved':result.has_saved,
					'freelance_id':freelance_id
				};
				updateFreelanceDetailSave(savedFreelanceData);
				dispatch(updateFreelanceState({type : 'updateFreelanceSaves', savedData:savedFreelanceData}));
				dispatch(updateUserFreelanceState({type : 'updateFreelanceSaves', savedData: savedFreelanceData}));
				dispatch(updateAppliedSavedFreelanceState({type : 'updateFreelanceSaves', savedData: savedFreelanceData}));
				dispatch(updateFeedState({type : 'updateFeedSaves', savedData: {
					'has_saved':result.has_saved,
					'feed_id':freelance_id,
					'feed_type':'freelance',
				} }));
			 	
			}
		}
		catch(error)
		{
			 console.log(error);
			 
		}
		 
		 
	}, [freelance_id, authToken]);
	
 

 
 
   return (
        <>
				 
				  {/* Show bid status if applicable */}
						{/*{already_bid && bids && bids.length > 0 && (
						<strong
							className={`m-0 pe-3 
								${bids[0].status === 'accepted' && 'text-success'}
								${bids[0].status === 'submitted' && 'text-primary'}
								${bids[0].status === 'in_review' && 'text-warning'}
								${bids[0].status === 'shortlisted' && 'text-info'}
								${bids[0].status === 'rejected' && 'text-danger'}
							`}
						>
							{bids[0].status === 'accepted' && 'Bid Accepted'}
							{bids[0].status === 'submitted' && 'Bid Submitted'}
							{bids[0].status === 'in_review' && 'Bid In Review'}
							{bids[0].status === 'shortlisted' && 'Bid Shortlisted'}
							{bids[0].status === 'rejected' && 'Bid Rejected'}
						</strong>
					)}
						*/}
				  {/* Show message if bid is placed but no status is available */}
					{already_bid  && (
						<strong className="text-success m-0 pe-3  ">
							 Bid Placed 
						</strong>
					)}
				  
					
					
					{/* Show deadline message if the job is expired */}
					{!already_bid && is_expired && (
						<strong className="text-danger m-0 pe-3   ">
							 Deadline Passed  
						</strong>
					)}
				 
					 
					
            <Button 
                variant="light" 
                title={has_saved ? "Saved" : "Save"} 
                id={`saveFreelanceWorkbtn{freelance_id}`} 
								 
								onClick={handleJobSave}
            >
							{has_saved ? <BsBookmark /> : <BsBookmarkPlus /> }
							<span className="ps-2">{has_saved ? "Saved" : "Save"} 	</span>						
                
            </Button>
        
		 
		
		</>
  );
};

export default memo(FreelanceActions);
