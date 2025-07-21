import { memo, useState,  useEffect, useCallback  } from 'react';   
import {useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import  Spinner  from 'react-bootstrap/Spinner'; 
import  Button  from 'react-bootstrap/Button'; 
import  Image  from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup'; 
 
import RatingStars from '../../Common/RatingStars.jsx';
import LargeText from '../../Common/LargeText';
import PostDate from '../Post/PostDate'; 
import LoadMoreButton from '../../Common/LoadMoreButton'; 
import serverConnection from '../../../CustomHook/serverConnection';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import handleImageError from '../../../CustomHook/handleImageError';


const WorkfolioReviewList = ({ workfolio_id, workfolioReviewList, setWorkfolioReviewList }) => {
  const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const [cursor, setCursor] = useState(null);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	  
			if(workfolio_id == null)
			{
				return;
			}
			setLoading(true);
			let requestData = {workfolio_id: workfolio_id, } ; 
			let url = `/get-workfolio-reviews?cursor=${cursor}`; 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			//update the post state in redux.
			
				//console.log(data);
			 if(data.reviews != null )
			 {   
					setWorkfolioReviewList((pre)=>[...pre, ...data.reviews.data]);			
					setCursor(data.reviews.next_cursor);
					setHasMore(data.reviews.next_cursor != null);
			 } 
			 setLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoading(false);
		}
			
	},[cursor, authToken]); 

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
			apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken]);
	
	//function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback((userID, ID)=>{
		 
		if(logedUserData.id == ID )
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${userID}/${ID}/profile`, 'append');
			navigate(`/user/${userID}/${ID}/profile`);
		}
			
	}, []);
	
  return (
    <div className="px-2  px-md-3 px-lg-4  py-5">
      <h6 className="pb-3">What People Are Saying...</h6>
			{
				workfolioReviewList.length <=0 &&  <div className="no-reviews" style={{ color: '#6c757d', fontStyle: 'italic' }}>
      <p>
        <strong>?? No reviews yet.</strong> Be the first to share your thoughts!
      </p>
    </div>
			}
			<ListGroup>
				{workfolioReviewList.map((review, index) => (
          <ListGroup.Item className="w-100   p-0 pb-2  border-bottom" key={index} >  
						<div className=" w-100  h-auto  px-2 py-2  d-flex flex-wrap   align-items-center" style={{backgroundColor:'rgba(200,200,200,0.1)',}}>
							<div className="btn p-0 border-0 " onClick={()=>{handleNavigateToUserProfile(review.user.userID,review.user.id);} } > 
								 <Image src={review.user.customer.image || '/images/login_icon.png' } className="profile_img  " onError={()=>{handleImageError(event, '/images/login_icon.png')} } alt={`profile image of ${review.user.userID}`}/> 
							</div>
							<div className=" " >
								
								<Button variant="*" className="border-0 p-0 pb-1 ps-3    fs-6 fw-bold " id={`userProfileNavigationBtn${review.user.userID}${index}`} title={`Go to user profile of ${review.user.userID} `} onClick={()=>{handleNavigateToUserProfile(review.user.userID,review.user.id);} }> {review.user.userID} </Button> 
								
								<RatingStars rating={review.rating} small={true} />
							</div> 
							
						</div>
						
						
						
						<div className="  px-2 pt-2  w-100">  
								<LargeText largeText={review.comment} key={index} />		
						</div>
						<div className="  px-2    w-100"> 
							<PostDate  postDate={review.created_at_human_readable}/> 
						</div>
						
					</ListGroup.Item>
        ))}
			</ListGroup>
			
			{loading && <div className="py-3 text-center"><Spinner animation="border" /></div>}
			{hasMore && !loading && (
				<LoadMoreButton apiCall={apiCall}  loading={loading} />
			)}
			 
    </div>
  );
};

export default memo(WorkfolioReviewList);
