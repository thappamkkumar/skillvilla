import { useState, useCallback, memo } from 'react'; 
import {useSelector, useDispatch } from 'react-redux'; 
import Offcanvas  from 'react-bootstrap/Offcanvas';
import Button  from 'react-bootstrap/Button';
import Form  from 'react-bootstrap/Form';  
import { BsStar, BsStarFill, BsX} from 'react-icons/bs';

import {updateFreelanceBidState} from '../../../StoreWrapper/Slice/FreelanceBidSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';

import MessageAlert from '../../MessageAlert';

const ReviewFreelancer = ({ 
	freelancer_id,	
	setOpenReviewBox, 
	openReviewBox,
	}) => {
		
		
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleReviewSubmit = useCallback(async(e) => {
    e.preventDefault();
		setSubmitting(true);
    if (rating === 0) { 
			setsubmitionMSG('Please provide a star rating.');
			setShowModel(true);
			setSubmitting(false);
			
      return;
    }

    if (comment.trim() === '') { 
			setsubmitionMSG('Please write your review.');
			setShowModel(true);
			setSubmitting(false);
      return;
    }

   
 
		 try
		 {
			  const reviewData = {
					freelancer_id,
					rating,
					comment,
				};
				let url = `/upload-freelancer-review`;
				 
				 
				//call the function fetch post data fron server
				let data = await serverConnection(url,reviewData, authToken);
				 //  console.log(data);
				if(data.status == true)
				{ 
					//set msg and promp true to visible
					setsubmitionMSG('Review is submitted successfully.');
					setShowModel(true); 
					//empty form field
					setRating(0);
					setComment('');
					 
					//update redux  
					 dispatch(updateFreelanceBidState({
						type : 'updateFreelancerReviewStats', 
						reviewStats: data.review_stats,
					}));
				  
					 
					 
				}
				else
				{
					setsubmitionMSG('Failed to submit review, try again.');
					setShowModel(true); 
				}
			  setSubmitting(false);
				
		 }
		 catch(error)
		 {
				 // console.log(error);
				setsubmitionMSG('Oops! Something went wrong.');
				setShowModel(true); 
				setSubmitting(false);
		 }
 
  }, [  freelancer_id, rating, comment, authToken]);

  return (
		<>
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
			
			<Offcanvas 
				show={openReviewBox}
				onHide={() => setOpenReviewBox(false)} 
				placement="bottom"
				className="bg-white rounded-top   mx-auto overflow-hidden"
				style={{width:'100%', maxWidth:'800px', height:'96vh'  }}
			>
        <Offcanvas.Header className="bg-white d-flex flex-wrap justify-content-end">
						 
						<Button
								 variant="outline-dark" className=" p-1  border border-2 border-dark " 
								 onClick={() => setOpenReviewBox(false)}
								id="closeShowImageAttachmentBTn"
								title="Close Preview"
						>
								<BsX className=" fw-bold fs-3" />
						</Button>
				</Offcanvas.Header>
        <Offcanvas.Body>
					<h3 className="mb-3" >Review Freelancer</h3>
					<Form onSubmit={handleReviewSubmit}>
						{/* Star Rating */}
						<div className="d-flex align-items-center mb-3">
							{[1, 2, 3, 4, 5].map((star) => (
								<div
									key={star}
									onClick={() => handleRating(star)}
									onMouseEnter={() => setHover(star)}
									onMouseLeave={() => setHover(0)}
									style={{ cursor: 'pointer', marginRight: '5px' }}
									className="reviewStarContainer"
								>
									{star <= (hover || rating) ? (
										<BsStarFill className="ms-1 fs-5 " />
									) : (
										<BsStar className="ms-1 fs-5 " />
									)}
								</div>
							))}
						</div>

						{/* Review Text */}
						<Form.Group controlId="comment" className="mb-3">
							<Form.Label>Write your review</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Share your views..."
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className="bg-transparent formInput"
							/>
						</Form.Group>

						{/* Submit Button */}
						<Button variant="dark" type="submit"  title="Submit Your Reviews" id="submitReviewBTN" disabled={submitting}>
							{submitting ? 'Submitting':'Submit Review'}
						</Button>
					</Form>
			
			
			
				</Offcanvas.Body>
      </Offcanvas>
		</>
	
    
  );
};

export default memo(ReviewFreelancer);

