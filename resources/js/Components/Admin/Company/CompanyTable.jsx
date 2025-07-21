import {useCallback, useState} from "react";
import {  useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Table  from "react-bootstrap/Table";
import Button  from "react-bootstrap/Button"; 
import Dropdown  from "react-bootstrap/Dropdown"; 
import Image  from "react-bootstrap/Image";
 
import { BsThreeDotsVertical, BsTrash3, BsCardText, BsStarFill} from "react-icons/bs";
 
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
import handleImageError from '../../../CustomHook/handleImageError'; 

import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
const CompanyTable = ({ companies }) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false); 
	const [deleteCompanyId, setDeleteCompanyId] = useState(null); 
	
	const navigate = useNavigate(); 
	const dispatch = useDispatch();
	
	 


	//navigate to user  profile
	const moreAboutCreator= useCallback((id, userId)=>{
		//manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);
	
	
		//navigate to company detail
	const moreAboutCompany = useCallback((id,)=>{
		//manageVisitedUrl(`/admin/company-detail/${id}`, 'append');
		navigate(`/admin/company-detail/${id}`);
	}, []);
	
	
	//delete company
	const handleDeleteCompany= useCallback(async()=>{
		setShowConfirm(false);
		if(deleteCompanyId == null || authToken == null)
		{
			return;
		}
		try
		{
			 
			//call the   server
			let data = await serverConnection('/admin/delete-company', {id:deleteCompanyId}, authToken);
		//console.log(data);
			 
			if(data.status)
			{
				  
				dispatch(updateListState({type : 'ItemDelete', deleted_id: deleteCompanyId}));
				setsubmitionMSG('Company is deleted successfully.');
					
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the company. Please try again.');
				 
			}
			 
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.');
				 
		}
		finally
		{
			setDeleteCompanyId(null); 
			setShowModel(true)
		}
		
		 
		
	}, [authToken, deleteCompanyId, setDeleteCompanyId]);
	
 
	
  return ( 
		<div className="mt-4 mb-4 sub_main_container p-2 overflow-auto " style={{minHeight:'40vh'}} >
        <Table   bordered     variant="white" className="  m-0    text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th> 
              <th>Logo</th>
              <th>Name</th>
              <th>Managed By</th>
              <th>Industry</th>
              <th>Established year</th>
              <th>Total jobs</th> 
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {companies && companies.length > 0 ? (
              companies.map((company, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>
										<div className="btn p-0 border-0 " onClick={()=>moreAboutCompany(company.id)} >  
											<Image src={company?.logo || '/images/login_icon.png'} 
											className="comment_profile_image"
											onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
											  loading="lazy"
											alt={`Image of company ${company.title}"`}/> 
											
										</div>
									</td>
									<td>{company.name}</td>
									<td>
										<Button 
											 variant="light"
											 id={`userProfile${company.user.id}`}
											 title={`Profile of ${company.user.userID}`}
											className="py-0 "
											onClick={()=>{moreAboutCreator(company.user.id, company.user.userID)}} 
										>
											{company.user.userID}
                    </Button> 
									</td>
                  <td>{company.industry}</td>
                  
                  <td>{company.established_year}</td>
                  <td>{company.jobs_count}</td>
                   
                   
									<td>
									
										<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`companyAction${company.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
												<Dropdown.Item as="button" variant="*" id={`companyDetail${company.id}`} title={`Company detail "${company.id}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutCompany(company.id)}>
													<BsCardText /> <span className="px-2">Detail </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deleteCompany${company.id}`} title={`Delete company "${company.id}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeleteCompanyId(company.id); setShowConfirm(true); }
													
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
                <td colSpan="8" className="py-4 fw-bold text-danger">No company found!</td>
              </tr>
            )}
          </tbody>
        </Table>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteCompany}
        message="Are you sure you want to delete this company."
        confirmLabel="Delete"
				/>
      </div>
    
  );
};

export default CompanyTable;
