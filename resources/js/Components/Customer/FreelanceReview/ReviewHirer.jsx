import { useState, useCallback, memo } from 'react'; 
import {useSelector, useDispatch } from 'react-redux'; 
import { Form, Button } from 'react-bootstrap';
import { BsStar, BsStarFill } from 'react-icons/bs';


import {updateFreelanceState} from '../../../StoreWrapper/Slice/FreelanceSlice';
import {updateFreelanceState as updateUserFreelanceState} from '../../../StoreWrapper/Slice/UserFreelanceSlice';
import {updateFreelanceState as updateMyFreelanceState} from '../../../StoreWrapper/Slice/MyFreelanceSlice';
import {updateFreelanceState as updateAppliedSavedFreelanceState} from '../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice'; 
import { updateFeedState } from '../../../StoreWrapper/Slice/FeedSlice';
 
 
import serverConnection from '../../../CustomHook/serverConnection';

import MessageAlert from '../../MessageAlert';

const ReviewHirer = ({ 
	
	hirer_id,
	setFreelanceDetail= ()=>{},
	
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
					hirer_id,
					rating,
					comment,
				};
				let url = `/upload-hirer-review`;
				 
				 
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
					
					// update review
					setFreelanceDetail((pre)=>({   
						...pre, 
						user: 
						{
							  ...pre.user,
								hirer_review_stats: 
								{
									avg_rating: data.hirer_review_stats.avg_rating,
									review_count: data.hirer_review_stats.review_count,
								},
						}
						 
					}) );
					
					 
					
					//update redux  
					dispatch(updateFreelanceState({
						type : 'updateHirerReviewStats', 
						hirerRivewStats: data.hirer_review_stats,
					}));
					dispatch(updateUserFreelanceState({
						type : 'updateHirerReviewStats', 
						hirerRivewStats: data.hirer_review_stats,
					}));
					dispatch(updateMyFreelanceState({
						type : 'updateHirerReviewStats', 
						hirerRivewStats: data.hirer_review_stats,
					}));
					dispatch(updateAppliedSavedFreelanceState({
						type : 'updateHirerReviewStats', 
						hirerRivewStats: data.hirer_review_stats,
					}));
					dispatch(updateFeedState({
						type : 'updateFeedFreelanceHirerReviewStats', 
						hirerRivewStats: data.hirer_review_stats,
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
 
  }, [  hirer_id, rating, comment, authToken]);

  return (
    <div className="px-2  px-md-3 px-lg-4  py-5 review_form_container"  > 
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
			<h3 >Review   Hirer</h3>
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
						className="bg-transparent reviewformInput"
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="light" type="submit"  title="Submit Your Reviews" id="submitReviewBTN" disabled={submitting}>
          {submitting ? 'Submitting':'Submit Review'}
        </Button>
      </Form>
    </div>
  );
};

export default memo(ReviewHirer);

