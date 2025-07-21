import { memo, useState,  useEffect, useCallback  } from 'react';   
import {useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import  Spinner  from 'react-bootstrap/Spinner'; 
import  Button  from 'react-bootstrap/Button'; 
import  Image  from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
  
import { BsThreeDotsVertical, BsTrash3 } from "react-icons/bs"; 

import ProblemAttachment from './ProblemAttachment'; 
import PostDate from '../Post/PostDate'; 
import LargeText from '../../Common/LargeText';
 

import MessageAlert from '../../MessageAlert'; 
import LoadMoreButton from '../../Common/LoadMoreButton'; 
import serverConnection from '../../../CustomHook/serverConnection';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import handleImageError from '../../../CustomHook/handleImageError';

import {updateProblemState} from '../../../StoreWrapper/Slice/ProblemSlice';
import {updateProblemState as updateUserProblemState} from '../../../StoreWrapper/Slice/UserProblemSlice';

const ProblemSolutionList = ({ problem_id, problemSolutionList, setProblemSolutionList, handleSolutionDelete, updateProblemSolutionCount}) => {
  const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const [cursor, setCursor] = useState(null);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	
	
 
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			
			if(problem_id == null)
			{
				return;
			}
			setLoading(true);
			let requestData = {problem_id: problem_id, } ; 
			let url = `/get-problem-solution?cursor=${cursor}`; 
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			  //console.log(data);
			 if(data.solutions != null )
			 {    
					setProblemSolutionList((pre)=>[...pre, ...data.solutions.data]);			
					setCursor(data.solutions.next_cursor);
					setHasMore(data.solutions.next_cursor != null);
			 } 
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
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
	
	const handleDeleteSolution = useCallback(async(solution_id)=>{
		if(solution_id == null)
		{
			return;
		}
		try
		{
			 
			let data = await serverConnection(`/delete-problem-solution`, {id: solution_id, }, authToken);
				//console.log(data);
			 if(data.status == true)
			 {
					setsubmitionMSG( 'Solution is deleted successfully.');
					setShowModel(true); 
					handleSolutionDelete(solution_id);
					
					//update solution count in  detail local state 
					updateProblemSolutionCount(data.solutionCount);
					
					//update redux problem States
					dispatch(updateProblemState({type : 'updateSolutionCount', solutionCount: data.solutionCount}));
					dispatch(updateUserProblemState({type : 'updateSolutionCount', solutionCount: data.solutionCount}));
			 }
			 else
			 {
					setsubmitionMSG( 'Oops! Something went wrong.');
					setShowModel(true); 
			 }
		}
		catch(error)
		{
			//console.log(error);
			//setLoading(false);
		}
	}, [authToken]);
	
	
  return (
    <div className="py-4 px-2">
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
			
      <h6 className="pb-3">Solutions Shared by Others...</h6>
			{
				problemSolutionList.length <=0 &&  
				<div className="no-reviews" style={{ color: '#6c757d', fontStyle: 'italic' }}>
					<p>
						<span>No solutions submitted yet. Your idea could make a difference!</span>
					</p>
				</div>
			}
			<ListGroup className=" border border-1 ">
				{problemSolutionList.map((solution, index) => (
				
					solution.deleted != null && solution.deleted == true ? 
					(
						<ListGroup.Item className="w-100   p-0  border-bottom border-1 overflow-hidden no_posts_message rounded-0 " key={index} style={{boxShadow:'0px 0px 20px 2px rgba(150,150,150,0.1) inset', maxWidth:'100%',}}  > 
							<div className="shadow w-100 py-3 px-2   ">
								<h5 className="">This solution is no longer available.</h5>
							</div>
						</ListGroup.Item  > 
					):(
					
						 <ListGroup.Item className="w-100   p-0 pb-2  border-bottom border-1 overflow-hidden " key={index} > 
							
							<div className="p-2 fw-bold" style={{backgroundColor:'rgba(240,240,240,1)',}}><i><span  >Sol. </span> <strong className="fs-4 ">{index+1}</strong></i></div>
							
							{/*user image, user id, and button for delete solution*/}
							<div className=" w-100  h-auto   d-flex  justify-content-between  align-items-center  RelativeContainer  "  >
								<div className=" d-flex p-2  overflow-hidden  align-items-center  ">
									<div className="btn p-0 border-0 " onClick={()=>{handleNavigateToUserProfile(solution.user.userID,solution.user.id);} } > 
										 <Image src={solution.user.customer.image || '/images/login_icon.png'} className="profile_img  " 
										 onError={()=>{handleImageError(event, '/images/login_icon.png')} } alt={`profile image of ${solution.user.userID}`}/> 
									</div>
									<div className="px-3 " style={{overflow:'hidden'}} >
										<Button variant="*" className="border-0 p-0 fs-5 fw-bold text-start   postTruncate" id={`userProfileNavigationBtn${solution.user.userID}${solution.user.name}`}  title="Go to user profile" onClick={()=>{handleNavigateToUserProfile(solution.user.userID,solution.user.id);} }> {solution.user.name}</Button> 
										 
										<Button variant="*" className="border-0 p-0 text-start postTruncate" id={`userProfileNavigationBtn${solution.user.userID}`}  title="Go to user profile" onClick={()=>{handleNavigateToUserProfile(solution.user.userID,solution.user.id);} }> <small>{solution.user.userID}  </small></Button> 
										 
									</div> 
								</div> 
								{
									(logedUserData.id == solution.user.id) &&
									(
										<div className="ps-3  "  > 
											<Dropdown className=" postMoreBTN  "> 
												 
												<Dropdown.Toggle variant="*" id={`dropdown-basic-${solution.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
													
												 
												<Dropdown.Menu className=" p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}> 
						 
														<Dropdown.Item as="button" variant="light" id={`deleteproblemSolutionButton-${solution.id}`}  title="Delete Solution" className="py-2 rounded exploreFilterClearBTN" onClick={()=>{handleDeleteSolution(solution.id);}}>
															<BsTrash3  /> <span className="px-2">Delete </span>	
														</Dropdown.Item>
													 
												</Dropdown.Menu>
											</Dropdown>
										</div>
									)
								}
								
							</div>
							
							
							{/*Solution description*/}
							<div className="  px-2 pt-2  w-100"> 
								<strong>Solution :- </strong>  
									<LargeText largeText={solution.solution} key={index} />								
							</div>
							 
							{/*soultion attachment if have*/}
							{
								solution.attachment != null &&
								<div className="  px-2 pt-3  w-100"> 
									<ProblemAttachment id={solution.id} attachment={solution.attachment}    heading={' '} component={'problemSolution'} />
								</div>
								
							}
										
							{/*date of post*/}
							<div className="  px-2    w-100"> 
								<PostDate  postDate={solution.created_at_human_readable}/> 
							</div>
						</ListGroup.Item>
					)
         
        ))}
			</ListGroup>
			
			{loading && <div className="py-3 text-center"><Spinner animation="border" /></div>}
			{hasMore && !loading && (
				<LoadMoreButton apiCall={apiCall}  loading={loading} />
			)}
			 
    </div>
  );
};

export default memo(ProblemSolutionList);
