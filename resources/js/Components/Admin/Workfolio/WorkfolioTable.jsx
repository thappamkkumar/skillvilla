import {useCallback, useState} from "react";
import {  useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Table  from "react-bootstrap/Table";
import Button  from "react-bootstrap/Button"; 
import Dropdown  from "react-bootstrap/Dropdown"; 
 
import { BsThreeDotsVertical, BsTrash3, BsCardText, BsStarFill} from "react-icons/bs";
 
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 
 
 
import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
const WorkfolioTable = ({ workfolios }) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false); 
	const [deleteWorkfolioId, setDeleteWorkfolioId] = useState(null); 
	
	const navigate = useNavigate(); 
	const dispatch = useDispatch();
	
	 


	//navigate to user  profile
	const moreAboutCreator= useCallback((id, userId)=>{
	//	manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);
	
	
		//navigate to workfolio detail
	const moreAboutWorkfolio = useCallback((id,)=>{
	//	manageVisitedUrl(`/admin/workfolio-detail/${id}`, 'append');
		navigate(`/admin/workfolio-detail/${id}`);
	}, []);
	
	
	//delete workfolio
	const handleDeleteWorkfolio= useCallback(async()=>{
		setShowConfirm(false);
		if(deleteWorkfolioId == null || authToken == null)
		{
			return;
		}
		try
		{
			 
			//call the   server
			let data = await serverConnection('/delete-workfolio', {id:deleteWorkfolioId}, authToken);
			//console.log(data);
			 
			if(data.status)
			{
				  
				dispatch(updateListState({type : 'ItemDelete', deleted_id: deleteWorkfolioId}));
				setsubmitionMSG('Workfolio is deleted successfully.');
					
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the workfolio. Please try again.');
				 
			}
			 
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.');
				 
		}
		finally
		{
			setDeleteWorkfolioId(null); 
			setShowModel(true)
		}
		
		 
		
	}, [authToken, deleteWorkfolioId, setDeleteWorkfolioId]);
	
	const formatRating = (rating) => {
		return parseFloat(rating).toFixed(1).replace(/\.0$/, ""); 
	};

	
  return ( 
		<div className="mt-4 mb-4 sub_main_container p-2 overflow-auto " style={{minHeight:'40vh'}} >
        <Table   bordered     variant="white" className="  m-0    text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th> 
              <th>Title</th>
              <th>Post By</th>
              <th>Rating</th>
              <th>Total Reviews</th>
              <th>Posted</th> 
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {workfolios && workfolios.length > 0 ? (
              workfolios.map((workfolio, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{workfolio.title}</td>
                  <td>
										<Button 
											 variant="light"
											 id={`userProfile${workfolio.user.id}`}
											 title={`Profile of ${workfolio.user.userID}`}
											className="py-0 "
											onClick={()=>{moreAboutCreator(workfolio.user.id, workfolio.user.userID)}} 
										>
											{workfolio.user.userID} 
                    </Button>
									</td>
                  <td className="d-flex align-items-center justify-content-center gap-1 ">
										<span >
											{
												workfolio.workfolio_review_avg_rating
												?
													formatRating(workfolio.workfolio_review_avg_rating) 
												: 
												0
											}
										</span>
										<BsStarFill className="text-danger"/>
									</td>
                  <td>{workfolio.workfolio_review_count}</td>
                  <td>{workfolio.created_at_formated}</td>
                   
                   
									<td>
									
										<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`userAction${workfolio.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
												<Dropdown.Item as="button" variant="*" id={`workfolioDetail${workfolio.id}`} title={`Workfolio detail "${workfolio.id}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutWorkfolio(workfolio.id)}>
													<BsCardText /> <span className="px-2">Detail </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deleteWorkfolio${workfolio.id}`} title={`Delete workfolio "${workfolio.id}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeleteWorkfolioId(workfolio.id); setShowConfirm(true); }
													
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
                <td colSpan="6" className="py-4 fw-bold text-danger">No workfolio found!</td>
              </tr>
            )}
          </tbody>
        </Table>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteWorkfolio}
        message="Are you sure you want to delete this workfolio."
        confirmLabel="Delete"
				/>
      </div>
    
  );
};

export default WorkfolioTable;
