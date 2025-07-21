import { useState, useCallback, memo } from 'react'; 
import {useSelector, useDispatch } from 'react-redux';  

import AddFreelanceBidForm from './AddFreelanceBidForm';

 import {updateFreelanceState as updateAppliedSavedFreelanceState} from '../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice';
 import {updateFreelanceState as updateUserFreelanceState} from '../../../StoreWrapper/Slice/UserFreelanceSlice';
 import {updateFreelanceState } from '../../../StoreWrapper/Slice/FreelanceSlice';
import serverConnection from '../../../CustomHook/serverConnection';

import MessageAlert from '../../MessageAlert';

const AddFreelanceBid = ({ freelance_id, setFreelanceDetail   }) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	
  const [placedBid, setPlacedBid] = useState(null); //state for store  msg to show
  const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const [formData, setFormData] = useState({ 
    cover_letter: '',
    bid_amount: '',
    payment_type: '',
    delivery_time: '',
  });
	const [errors, setErrors] = useState({});
 
 
 
  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.cover_letter || formData.cover_letter.trim().length < 10) {
      newErrors.cover_letter = 'Cover letter must be at least 10 characters long.';
    }

    if (!formData.bid_amount || isNaN(formData.bid_amount) || Number(formData.bid_amount) <= 0) {
      newErrors.bid_amount = 'Bid amount must be a positive number.';
    }

    if (!formData.payment_type) {
      newErrors.payment_type = 'Please select a payment type.';
    }

    if (!formData.delivery_time || formData.delivery_time.trim().length === 0) {
      newErrors.delivery_time = 'Delivery time is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBidSubmit = useCallback(async(e) => {
    e.preventDefault();
		 if (!validateForm()) {
      return;
    }

    setSubmitting(true);  
		setPlacedBid(null)
		try
		{
			  const payload = {
					...formData,
					freelance_id, // Add freelance ID explicitly here
				};
				let url = `/place-bid-for-freelance-work`;
				 
				  
				//call the function fetch post data fron server
			 	let data = await serverConnection(url,payload, authToken);
				 //console.log(data.freelanceBid);
				if(data && data.status == true)
				{ 
					//set msg and promp true to visible
					setsubmitionMSG('Your bid is submitted successfully.');
					setShowModel(true); 
					 setFormData({ 
						cover_letter: '',
						bid_amount: '',
						payment_type: '',
						delivery_time: '',
					});
					setErrors({});
					 if(data.freelanceBid)
					 {	
							setPlacedBid([data.freelanceBid]); 
					 }
					 
				}
				else
				{
					setsubmitionMSG('Failed to upload your bid. Please try again.');
					setShowModel(true); 
				} 
			  setSubmitting(false);
				
		 }
		 catch(error)
		 {
				console.log(error);
				setsubmitionMSG('An error occurred. Please try again.'); 
				setShowModel(true); 
				setSubmitting(false);
		 }
 
  }, [ freelance_id, formData,  authToken  ]);



	
//handle close message box
const handleCloseMessageBox = useCallback(()=>{
	setShowModel(false); 
	
	if(placedBid != null)
	{
		setFreelanceDetail((pre)=>({...pre, bids:placedBid, already_bid:true }));
		dispatch(updateUserFreelanceState({type : 'bidPlaced', freelance_id: freelance_id		}));
		dispatch(updateFreelanceState({type : 'bidPlaced', freelance_id: freelance_id		}));
		dispatch(updateAppliedSavedFreelanceState({type : 'bidPlaced', freelance_id: freelance_id		}));
	}
},[setFreelanceDetail, freelance_id, placedBid]);



  return (
    <div className="px-2  px-md-3 px-lg-4  py-5 review_form_container"  > 
			<MessageAlert setShowModel={handleCloseMessageBox} showModel={showModel} message={submitionMSG}/>	
			<h3 >Add your bid</h3>
        
				<AddFreelanceBidForm 
				formData={formData}
				setFormData={setFormData}
				errors={errors}  
				onSubmit={handleBidSubmit}
				submitting={submitting}
				/> 
    </div>
  );
};

export default memo(AddFreelanceBid);




