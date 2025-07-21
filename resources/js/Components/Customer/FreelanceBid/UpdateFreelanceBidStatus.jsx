 

import   {memo,  useCallback, useState } from 'react'; 
import {useSelector, useDispatch } from 'react-redux';  
import Dropdown from 'react-bootstrap/Dropdown';

import {updateFreelanceBidState} from '../../../StoreWrapper/Slice/FreelanceBidSlice';
 
import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';
   
const UpdateFreelanceBidStatus = ({
	bidId,
	bidStatus, 
	
	}) => {
	  
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	  
	//  question time limit onChange handlers
	const updateStauts = useCallback(async(selectedStatus) => {
		 
		try {
      const formData = {
        bid_id:bidId,
        status:selectedStatus
      };
			//console.log(formData);
      setSubmitting(true);
			
			
			const response = await serverConnection('/update-freelance-bid-status', formData, authToken);
			  //console.log(response);
 
      if (response.status === true) {
        setsubmitionMSG('Freelance bid status is updated successfully!');
        setShowModel(true);
				
				//update bid status in redux state for freelance bids
				dispatch(updateFreelanceBidState({type :'updateFreelanceBidStatus', newStatus: formData}));
          
      } else {
        setsubmitionMSG('Failed to update the  freelance bid status. Please try again.');
        setShowModel(true);
      } 
		 
			 setSubmitting(false);
    } catch (error) {
			 //console.log(error);
      setsubmitionMSG('An error occurred. Please try again.');
      setShowModel(true);
			setSubmitting(false);
    } 
	},[authToken,   bidId]);
	
	
	
	
	
 
  
 
	return ( 
		<div className="  ">
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
			 
				 <Dropdown>
              <Dropdown.Toggle
                variant="dark"
                id={`jobDropDownMenu${bidId}`}
                title="Select status"
                className="    custom_dropdown_toggle_post_header"
								disabled={submitting}
              > 
                  {submitting ? 'Updating...':'Update'}
              </Dropdown.Toggle>
             
            <Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" 	 style={{ overflow: 'hidden' }}>
               
								
								{/*<Dropdown.Item
                    as="button"
                    id={`submitOption${bidId}`}
                    title="Select Submitted "
                    className="py-2 rounded navigation_link"
                    onClick={()=>{updateStauts('submitted')}}
                  > 
                    Submitted
                  </Dropdown.Item>  
								*/} 
									<Dropdown.Item
                    as="button"
                    id={`inReviewOption${bidId}`}
                    title="Select In Review "
                    className="py-2 rounded navigation_link"
                    onClick={()=>{updateStauts('in_review')}}
                  > 
                    In Review
                  </Dropdown.Item>  
               
									<Dropdown.Item
                    as="button"
                    id={`shortlistedOption${bidId}`}
                    title="Select Shortlisted "
                    className="py-2 rounded navigation_link"
                    onClick={()=>{updateStauts('shortlisted')}}
                  > 
                    Shortlisted
                  </Dropdown.Item>  
                  
									 <Dropdown.Item
                    as="button"
                    id={`acceptedOption${bidId}`}
                    title="Select Accepted"
                    className="py-2 rounded navigation_link"
                    onClick={()=>{updateStauts('accepted')}}
                  > 
                    Accepted
                  </Dropdown.Item>  
                  
									 
									   
                  
									 <Dropdown.Item
                    as="button"
                    id={`rejectedOption${bidId}`}
                    title="Select Rejected"
                    className="py-2 rounded navigation_link"
                    onClick={()=>{updateStauts('rejected')}}
                  > 
                    Rejected
                  </Dropdown.Item>  
                  
									 

                 
             
            </Dropdown.Menu>
          </Dropdown>
				
				
				
				
				
					 

				 
			 
		</div>
	);
	
};

export default memo(UpdateFreelanceBidStatus);
