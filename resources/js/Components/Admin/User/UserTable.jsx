import {useCallback, useState} from "react";
import {  useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Table  from "react-bootstrap/Table"; 
import Dropdown  from "react-bootstrap/Dropdown";
import Image  from "react-bootstrap/Image";
 
import { BsThreeDotsVertical, BsTrash3, BsPerson} from "react-icons/bs";
 
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
import handleImageError from '../../../CustomHook/handleImageError'; 

import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
const UserTable = ({ users }) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false); 
	const [deleteUserId, setDeleteUserId] = useState(null); 
	
	const navigate = useNavigate(); 
	const dispatch = useDispatch();
	
	//update active status
	const updateUserStatus = useCallback(async(id)=>{
		try
		{
			if(authToken == null ){return;}
			 setUpdatingStatus(true);
			//call the   server
			let data = await serverConnection('/admin/update-user-active-status', {user_id:id}, authToken);
			//console.log(data);
			if(!data)
			{
				return;
			}
			if(data.status)
			{
				  
				dispatch(updateListState({
					type : 'updateUserActiveStatus', 
					statusData: {
						user_id : id,
						status: data.is_active
					}
				}));
				setsubmitionMSG( 'User status is updated successfully.');
					
			}
			else
			{
				setsubmitionMSG( 'Failed to update the status. Please try again.');
				 
			}
			 
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.');
				 
		}
		finally
		{
			setUpdatingStatus(false);
			setShowModel(true)
		}
			
	}, [authToken]);
	


	//navigate to user  profile
	const moreAboutUser = useCallback((id, userId)=>{
		//manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);
	
	
	//navigate to user  profile
	const handleDeleteUser = useCallback(()=>{
		if(deleteUserId == null)
		{
			return;
		}
		alert('delete ' + deleteUserId); 
		dispatch(updateListState({type : 'ItemDelete', deleted_id: deleteUserId}));
		setDeleteUserId(null);
		
	}, [deleteUserId, setDeleteUserId]);
	
	
	
  return ( 
		<div className="mt-4 mb-4 sub_main_container p-2 overflow-auto " style={{minHeight:'40vh'}} >
        <Table   bordered     variant="white" className="  m-0    text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No.</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>
										<div className="btn p-0 border-0 " 
										onClick={()=> moreAboutUser(user.id, user.userID)} > 
						
											<Image src={user?.customer?.image || '/images/login_icon.png'} 
											className="comment_profile_image"
											onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
											  loading="lazy"
											alt={`Profile image of ${user.name}"`}/> 
											
										</div>
									</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.user_role}</td>
                  <td>
                    <button 
											className="badge border-0 "
											onClick={()=>{updateUserStatus(user.id)}}
											style={{
												backgroundColor: user.is_active ? "#d4edda" : "#f8d7da",  
												color: user.is_active ? "#155724" : "#721c24",   
												cursor:'pointer', 
											}}
											
											disabled={updatingStatus}
										>
											{
												 
												user.is_active  ? "Active" : "InActive"
											}
                    
                    </button>
                  </td>
									<td>
									
										<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`userAction${user.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
														<Dropdown.Item as="button" variant="*" id={`userProfile${user.id}`} title={`User profile"${user.name}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutUser(user.id, user.userID)}>
															<BsPerson /> <span className="px-2">Profile </span>	
														</Dropdown.Item>
														{/*
														<Dropdown.Item as="button" variant="*" id={`deleteUser${user.id}`} title={`Delete user "${user.name}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
															() => {setDeleteUserId(user.id); setShowConfirm(true); }
															
															}>
															<BsTrash3 /> <span className="px-2">Delete </span>	
														</Dropdown.Item>
														*/}
											</Dropdown.Menu>
										</Dropdown>
										
                     
                     
										 
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 fw-bold text-danger">No users found  !</td>
              </tr>
            )}
          </tbody>
        </Table>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteUser}
        message="Are you sure you want to delete this user."
        confirmLabel="Delete"
				/>
      </div>
    
  );
};

export default UserTable;
