  import   {memo, useCallback}  from 'react';
import { useNavigate } from 'react-router-dom';  
import {useDispatch } from 'react-redux'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
import { BsThreeDotsVertical ,     BsCardList , BsBookmark   } from "react-icons/bs"; 
import {updateWorkfolioState as updateMyWorkfolioState} from '../../../StoreWrapper/Slice/MyWorkfolioSlice';
import {updateWorkfolioState as updateSavedWorkfolioState} from '../../../StoreWrapper/Slice/SavedWorkfolioSlice';
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const WorkfolioHeader = ({heading = "Works", myWork=false}) => { 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
	//function use to handle navigation to add new work
	/*const handleNavigateToAddWork = useCallback(()=>{
		 manageVisitedUrl(`/workfolio/add-new`, 'append'); 
		 navigate('/workfolio/add-new');
		 
	}, []);*/
 
	 //function use to handle navigation to my work list
	const handleNavigateToMyWork = useCallback(()=>{ 
		dispatch(updateMyWorkfolioState({type : 'refresh'}));
		 
		//manageVisitedUrl('/workfolio/my-works', 'append');
		navigate('/workfolio/my-works');		
		 
	}, []);
	//handle navigation  to saved workfolio
	const handleNavigateToSavedWork = useCallback(()=>{ 
		dispatch(updateSavedWorkfolioState({type : 'refresh'}));
		 
		//manageVisitedUrl('/workfolio/saved', 'append');
		navigate('/workfolio/saved');		
		 
	}, []);
	
	
	return ( 
		<div className=" d-flex gap-2 justify-content-between align-items-start  px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<h3 className="fw-bold  ">{heading} </h3>
			
				<Dropdown className="  ">
					 <Dropdown.Toggle variant="light" id="workfolioDropDownMenu" title="more" className="    custom_dropdown_toggle_post_header  fs-5  px-2 pt-0 pb-1   ">
							<BsThreeDotsVertical  />
						</Dropdown.Toggle>
					 
					 
					<Dropdown.Menu className="p-2 border-0 dropdown_menu shadow" style={{overflow:'hidden',}}>
					 
					 {/*	<Dropdown.Item as="button" variant="*" id="addNewWorkBtn" title="Add new work"  className="py-2   rounded d-flex align-items-center gap-2   navigation_link" onClick={handleNavigateToAddWork}><BsPlusSquare  /> <span className="px-2">New Work </span></Dropdown.Item>
					 */}

					 {
						!myWork &&
						<Dropdown.Item as="button" variant="*" id="myWorksBtn" title="My work"   className="py-2  d-flex align-items-center gap-2  rounded  navigation_link" onClick={handleNavigateToMyWork}><BsCardList      /> <span className="px-2">My Works </span></Dropdown.Item>
					 }
						<Dropdown.Item as="button" variant="*" id="savedWorksBtn" title="Saved work"   className="py-2  d-flex align-items-center gap-2  rounded  navigation_link" onClick={handleNavigateToSavedWork}><BsBookmark />  	 <span className="px-2">Saved Works </span></Dropdown.Item>
					  	 
						 
					</Dropdown.Menu>
				</Dropdown>
			 
		</div>
	);
};

export default memo(WorkfolioHeader);