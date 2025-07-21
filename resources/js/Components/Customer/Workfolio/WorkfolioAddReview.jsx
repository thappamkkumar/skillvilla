import { useState, useCallback, memo } from 'react'; 
import {useSelector, useDispatch } from 'react-redux'; 
import { Form, Button } from 'react-bootstrap';
import { BsStar, BsStarFill } from 'react-icons/bs';

import {updateWorkfolioState} from '../../../StoreWrapper/Slice/WorkfolioSlice';
import {updateWorkfolioState as updateUserWorkfolioState} from '../../../StoreWrapper/Slice/UserWorkfolioSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';

import TextEditor from '../../Common/TextEditor'; 
import MessageAlert from '../../MessageAlert';

const WorkfolioAddReview = ({ workfolio_id, setWorkfolioReviewList, updateAvgAndCount }) => {
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
					workfolio_id,
					rating,
					comment,
				};
				let url = `/add-workfolio-review`;
				 
				 
				//call the function fetch post data fron server
				let data = await serverConnection(url,reviewData, authToken);
				// console.log(data);
				if(data.status == true)
				{ 
					//set msg and promp true to visible
					setsubmitionMSG('Review is submitted successfully.');
					setShowModel(true); 
					//empty form field
					setRating(0);
					setComment('');
					
					// add new review to review list state
					setWorkfolioReviewList((pre)=>[data.newReview, ...pre]);
					
					//update detail local state
					updateAvgAndCount(data.workfolioAvgANDCount.workfolio_review_avg_rating, data.workfolioAvgANDCount.workfolio_review_count );
					
					//update redux workfolioState
					dispatch(updateWorkfolioState({type : 'updateAvgAndCount', workfolioAvgANDCount: data.workfolioAvgANDCount}));
					dispatch(updateUserWorkfolioState({type : 'updateAvgAndCount', workfolioAvgANDCount: data.workfolioAvgANDCount}));
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
				 console.log(error);
				setsubmitionMSG('Oops! Something went wrong.');
				setShowModel(true); 
				setSubmitting(false);
		 }
 
  }, [ workfolio_id, rating, comment, authToken]);

	
	// handle add Comment for work
	const handleCommentChange = (val) => { 
        setComment(val);
    };
		
		
  return (
    <div className="px-2  px-md-3 px-lg-4  py-5 review_form_container"  > 
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
			<h3 >Reviews</h3>
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
           
					<TextEditor
							value={comment}
							onChange={handleCommentChange}
							className="custom-text-box dark-custom-text-box"
							placeholder="Share your solution..."
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

export default memo(WorkfolioAddReview);

