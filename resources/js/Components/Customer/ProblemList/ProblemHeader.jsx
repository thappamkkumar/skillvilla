  import   {memo, useCallback}  from 'react';
import { useNavigate } from 'react-router-dom';  
import {useDispatch } from 'react-redux'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
import { BsThreeDotsVertical ,     BsCardList, BsBookmark     } from "react-icons/bs"; 

import {updateProblemState as updateMyProblemState} from '../../../StoreWrapper/Slice/MyProblemSlice';
import {updateProblemState as updateSavedProblemState} from '../../../StoreWrapper/Slice/SavedProblemSlice';
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const ProblemHeader = ({heading="Problems", myProblem=false}) => { 

	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	

	 
 
 
 
 
	 //function use to handle navigation to saved problem list
	const handleNavigateToSavedProblem = useCallback(()=>{ 
		dispatch(updateSavedProblemState({type : 'refresh'}));
		 
		//manageVisitedUrl('/problems/saved', 'append');
		navigate('/problems/saved');		
		 
	}, []);
	
	
	 //function use to handle navigation to my problem list
	const handleNavigateToMyProblems = useCallback(()=>{ 
		dispatch(updateMyProblemState({type : 'refresh'}));
		 
		//manageVisitedUrl('/problems/my-problems', 'append');
		navigate('/problems/my-problems');		
		 
	}, []);
  
	return ( 
	<div className=" d-flex gap-2 justify-content-between align-items-start  px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<h3 className="fw-bold  ">{heading} </h3>
			
				<Dropdown   >
					 <Dropdown.Toggle variant="light" id="problemDropDownMenuBtn" title="More"  className="    custom_dropdown_toggle_post_header   fs-5  px-2 pt-0 pb-1  ">
							<BsThreeDotsVertical  />
						</Dropdown.Toggle>
					 
					 
					<Dropdown.Menu className="p-2 border-0 dropdown_menu shadow" style={{overflow:'hidden',}}>
					 
							
						 
						{
							!myProblem && 
							<Dropdown.Item as="button" variant="*" id="myProblemBtn" title="My Problem"  className="py-2  d-flex align-items-center  gap-2 rounded navigation_link" onClick={handleNavigateToMyProblems}><BsCardList   /> <span className="px-2">My Problems </span></Dropdown.Item>
						}	 
						
						<Dropdown.Item as="button" variant="*" id="saveProblemBtn" title="Saved Problem"  className="py-2  d-flex align-items-center  gap-2  rounded navigation_link" onClick={handleNavigateToSavedProblem}><BsBookmark  /> <span className="px-2">Saved Problem </span></Dropdown.Item>	 
						 
					</Dropdown.Menu>
				</Dropdown>
			 
		</div>
	);
};

export default memo(ProblemHeader);