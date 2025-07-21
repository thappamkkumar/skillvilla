import {useCallback, useState} from "react";
import {  useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Table  from "react-bootstrap/Table";
import Button  from "react-bootstrap/Button"; 
import Dropdown  from "react-bootstrap/Dropdown"; 
 
import { BsThreeDotsVertical, BsTrash3, BsCardText,  } from "react-icons/bs";
 
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';  

import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
const ProblemTable = ({ problems }) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false); 
	const [deleteProblemId, setDeleteProblemId] = useState(null); 
	
	const navigate = useNavigate(); 
	const dispatch = useDispatch();
	
	 


	//navigate to user  profile
	const moreAboutCreator= useCallback((id, userId)=>{
	//	manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);
	
	
		//navigate to problem detail
	const moreAboutProblem= useCallback((id,)=>{
		//manageVisitedUrl(`/admin/problem-detail/${id}`, 'append');
		navigate(`/admin/problem-detail/${id}`);
	}, []);
	
	
	//delete problem
	const handleDeleteProblem= useCallback(async()=>{
		setShowConfirm(false);
		if(deleteProblemId == null || authToken == null)
		{
			return;
		}
		try
		{
			 
			//call the   server
			let data = await serverConnection('/delete-problem', {id:deleteProblemId}, authToken);
			//console.log(data);
			 
			if(data.status)
			{ 
				dispatch(updateListState({type : 'ItemDelete', deleted_id: deleteProblemId}));
				setsubmitionMSG('Problem is deleted successfully.');
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the problem. Please try again.');
			}
			 
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.'); 
		}
		finally
		{
			setDeleteProblemId(null); 
			setShowModel(true)
		}
		 
	}, [authToken, deleteProblemId, setDeleteProblemId]);
	
	 
	
  return ( 
		<div className="mt-4 mb-4 sub_main_container p-2 overflow-auto " style={{minHeight:'40vh'}} >
        <Table   bordered     variant="white" className="  m-0    text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th> 
              <th>Title</th>
              <th>Asked By</th> 
              <th>Total Solution</th>
              <th>Posted</th> 
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {problems && problems.length > 0 ? (
              problems.map((problem, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td className="overflow-hidden ">
										<p className="m-0 text-truncate mx-auto"
											style={{maxWidth:'300px',}}
										>
										{problem.title}
										</p>
									</td>
                  <td>
										<Button 
											 variant="light"
											 id={`userProfile${problem.user.id}`}
											 title={`Profile of ${problem.user.userID}`}
											className="py-0 "
											onClick={()=>{moreAboutCreator(problem.user.id, problem.user.userID)}} 
										>
											{problem.user.userID} 
                    </Button>
									</td>
									<td>{problem.solutions_count}</td>
                  
                  <td>{problem.created_at_formated}</td>
                   
                   
									<td>
									
										<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`userAction${problem.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
												<Dropdown.Item as="button" variant="*" id={`problemDetail${problem.id}`} title={`Problem detail "${problem.id}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutProblem(problem.id)}>
													<BsCardText /> <span className="px-2">Detail </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deleteProblem${problem.id}`} title={`Delete problem "${problem.id}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeleteProblemId(problem.id); setShowConfirm(true); }
													
													}>
													<BsTrash3 /> <span className="px-2">Delete </span>	
												</Dropdown.Item>
													 
											</Dropdown.Menu>
										</Dropdown>
										
                     
                     
										 
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 fw-bold text-danger">No problem found!</td>
              </tr>
            )}
          </tbody>
        </Table>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteProblem}
        message="Are you sure you want to delete this problem."
        confirmLabel="Delete"
				/>
      </div>
    
  );
};

export default ProblemTable;
