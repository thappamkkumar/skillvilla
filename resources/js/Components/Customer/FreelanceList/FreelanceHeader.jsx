  import   {memo, useCallback}  from 'react';
import { useNavigate } from 'react-router-dom';  
import {useDispatch } from 'react-redux'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
import { BsThreeDotsVertical ,   BsClockHistory    , BsBookmarkCheck  , BsCardList     } from "react-icons/bs"; 

import {updateFreelanceState as updateAppliedSavedFreelanceState} from '../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice';
import {updateFreelanceState as updateMyFreelanceState} from '../../../StoreWrapper/Slice/MyFreelanceSlice';

//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const FreelanceHeader = ({heading="Freelance Work", myFreelance=false}) => { 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	//function use to handle navigation to add new freelance work
/*	const handleNavigateToAddFreelanceWork = useCallback(()=>{
		 manageVisitedUrl(`/freelance/add-new`, 'append'); 
		 navigate('/freelance/add-new');
		 
	}, []);
*/
 
	//function use to handle navigation to bid history
	const handleNavigateToBidsHistory = useCallback(()=>{ 
		dispatch(updateAppliedSavedFreelanceState({type : 'refresh'})); 
		//manageVisitedUrl('/freelance/applied', 'append');
		navigate('/freelance/applied');		
		 
	}, []);
	
	//function use to handle navigation to saved freelance work
	const handleNavigateToSavedFreelanceWork = useCallback(()=>{ 
		dispatch(updateAppliedSavedFreelanceState({type : 'refresh'})); 
		//manageVisitedUrl('/freelance/saved', 'append');
		navigate('/freelance/saved');		
		 
	}, []);
 
	 //function use to handle navigation to my freelance work
	const handleNavigateToMyFreelanceWork = useCallback(()=>{ 
		dispatch(updateMyFreelanceState({type : 'refresh'})); 
	//	manageVisitedUrl('/freelance/my-freelance', 'append');
		navigate('/freelance/my-freelance');		
		 
	}, []);
  
	return ( 
	 <div className=" d-flex gap-2 justify-content-between align-items-start  px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<h3 className="fw-bold  ">{heading} </h3>
			
			<Dropdown  >
				 <Dropdown.Toggle variant="light" id="freelanceDropDownMenuBtn" title="More"  className="    custom_dropdown_toggle_post_header   fs-5  px-2 pt-0 pb-1  ">
						<BsThreeDotsVertical  />
					</Dropdown.Toggle>
				 
				 
				<Dropdown.Menu className="p-2 border-0 dropdown_menu shadow" style={{overflow:'hidden',}}>
					{/*
						<Dropdown.Item as="button" variant="*" id="addNewFreelanceWorkBtn" title="Add New Freelance Work"  className="py-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={handleNavigateToAddFreelanceWork}><BsPlusSquare  /> <span className="px-2">New Freelance Work</span></Dropdown.Item>
					*/}
					
					{
							!myFreelance &&
							<Dropdown.Item as="button" variant="*" id="myFreelanceWorkBtn" title="My freelance work"  className="py-2 d-flex align-items-center gap-2  rounded navigation_link" onClick={handleNavigateToMyFreelanceWork}><BsCardList   /> <span className="px-2">My Freelance Gigs </span></Dropdown.Item>
						 
							
						}
						<Dropdown.Item as="button" variant="*" id="BidsHistoryBTN" title="Bids History"  className="py-2  rounded d-flex align-items-center gap-2  navigation_link" onClick={handleNavigateToBidsHistory}><BsClockHistory   /> <span className="px-2">Bids History</span></Dropdown.Item>
						
						<Dropdown.Item as="button" variant="*" id="savedFreelanceWorkBTN" title="Saved freelance work"  className="py-2 d-flex align-items-center  gap-2 rounded navigation_link" onClick={handleNavigateToSavedFreelanceWork}><BsBookmarkCheck    /> <span className="px-2">Saved Freelance Gigs </span></Dropdown.Item>
						
						
						
						
					 
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
};

export default memo(FreelanceHeader);