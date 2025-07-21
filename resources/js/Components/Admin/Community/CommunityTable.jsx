import {useCallback, useState} from "react";
import {  useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Table  from "react-bootstrap/Table";
import Button  from "react-bootstrap/Button"; 
import Dropdown  from "react-bootstrap/Dropdown";
import Image  from "react-bootstrap/Image";
 
import { BsThreeDotsVertical, BsTrash3, BsCardText} from "react-icons/bs";
 
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection'; 
 //import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
import handleImageError from '../../../CustomHook/handleImageError'; 

import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
const CommunityTable = ({ communities }) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false); 
	const [deleteCommunityId, setDeleteCommunityId] = useState(null); 
	
	const navigate = useNavigate(); 
	const dispatch = useDispatch();
	
	 


	//navigate to user  profile
	const moreAboutCreator= useCallback((id, userId)=>{
		//manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);
	
	
		//navigate to community  profile
	const moreAboutCommunity= useCallback((id,)=>{
		//manageVisitedUrl(`/admin/community-profile/${id}`, 'append');
		navigate(`/admin/community-profile/${id}`);
	}, []);
	
	
	//delete community
	const handleDeleteCommunity = useCallback(async()=>{
		setShowConfirm(false);
		if(deleteCommunityId == null || authToken == null)
		{
			return;
		}
		try
		{
			 
			//call the   server
			let data = await serverConnection('/delete-community', {communityId:deleteCommunityId}, authToken);
			//console.log(data);
			 
			if(data.status)
			{
				  
				dispatch(updateListState({type : 'ItemDelete', deleted_id: deleteCommunityId}));
				setsubmitionMSG('Community is deleted successfully.');
					
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the community. Please try again.');
				 
			}
			 
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.');
				 
		}
		finally
		{
			setDeleteCommunityId(null); 
			setShowModel(true)
		}
		
		 
		
	}, [authToken, deleteCommunityId, setDeleteCommunityId]);
	
	
	
  return ( 
		<div className="mt-4 mb-4 sub_main_container p-2 overflow-auto " style={{minHeight:'40vh'}} >
        <Table   bordered     variant="white" className="  m-0    text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Creator</th> 
              <th>Privacy</th>
              <th>Members</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {communities && communities.length > 0 ? (
              communities.map((community, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>
										<div className="btn p-0 border-0 " onClick={()=>moreAboutCommunity(community.id)} > 
						
											<Image src={community?.image || '/images/login_icon.png'} 
											className="comment_profile_image"
											onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
											  loading="lazy"
											alt={`Profile image of ${community.name}"`}/> 
											
										</div>
									</td>
                  <td>{community.name}</td>
									<td>
										 <Button 
											 variant="light"
											 id={`userProfile${community.creator.id}`}
											 title={`Profile of ${community.creator.userID}`}
											className="py-0 "
											onClick={()=>{moreAboutCreator(community.creator.id, community.creator.userID)}} 
										>
											{community.creator.userID}
                    
                    </Button>
									</td>
                  <td>{community.privacy}</td>
                  <td>{community.members_count}</td>
                  
                   
									<td>
									
										<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`userAction${community.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
												<Dropdown.Item as="button" variant="*" id={`communityProfile${community.id}`} title={`Community detail "${community.name}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutCommunity(community.id)}>
													<BsCardText /> <span className="px-2">Detail </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deleteCommunity${community.id}`} title={`Delete community "${community.name}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeleteCommunityId(community.id); setShowConfirm(true); }
													
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
                <td colSpan="6" className="py-4 fw-bold text-danger">No community found  !</td>
              </tr>
            )}
          </tbody>
        </Table>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteCommunity}
        message="Are you sure you want to delete this community."
        confirmLabel="Delete"
				/>
      </div>
    
  );
};

export default CommunityTable;
