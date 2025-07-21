 
import  {   memo  } from 'react';
//import {useSelector } from 'react-redux';
//import { useNavigate } from 'react-router-dom';
//import Button from 'react-bootstrap/Button';
//import PostHeader from '../Post/PostHeader'; 
import PostDate from '../Post/PostDate'; 
import RatingStars from '../../Common/RatingStars';
import WorkfolioHeader from './WorkfolioHeader';
import WorkfolioUploadBy from './WorkfolioUploadBy';
  
 
const Workfolio = ({workfolio, chatBox=false}) => { 
	//const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	
	 //	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
 
	 
	 
	 
	
	return ( 
		<div className="  sub_main_container  p-2 p-md-3 rounded  " >
			
			
			<WorkfolioHeader 
			title={workfolio.title}
			workfolio_id={workfolio.id}
			has_saved={workfolio.has_saved} 
			user_id={workfolio.user.id}  
			chatBox={chatBox}  
			/>
			
			
			<div className="d-flex align-items-center flex-wrap gap-2  py-1">
				<WorkfolioUploadBy 
					user={workfolio.user}
					id={workfolio.id}
				/>
				
				 <span className="text-secondary fs-5">|</span>
				 
				<div className="d-flex align-items-center     ">
					 <RatingStars rating={workfolio.workfolio_review_avg_rating} small={true} />
					 <small className="py-1 px-2 rounded-1   ms-2  tech_skill   "  >{workfolio.workfolio_review_count} reviews </small>
				</div>
			</div>
			
			 
			
			
			<PostDate  postDate={workfolio.created_at_human_readable}/> 
	
		 
		</div>
	);
	
};

export default memo(Workfolio);
