import {useCallback, useState} from "react";
import {  useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Table  from "react-bootstrap/Table";
import Button  from "react-bootstrap/Button"; 
import Dropdown  from "react-bootstrap/Dropdown";
import Image from 'react-bootstrap/Image'; 
 
import { BsThreeDotsVertical, BsTrash3, BsCardText} from "react-icons/bs";
 
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
import handleImageError from '../../../CustomHook/handleImageError'; 

import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
const StoryTable = ({ stories }) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false); 
	const [deleteStoryId, setDeleteStoryId] = useState(null); 
	
	const navigate = useNavigate(); 
	const dispatch = useDispatch();
	
	 


	//navigate to user  profile
	const moreAboutUser= useCallback((id, userId)=>{
	//	manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);
	
	
		//navigate to  story detail
	const moreAboutStory= useCallback((id,)=>{
		//manageVisitedUrl(`/admin/story-detail/${id}`, 'append');
		navigate(`/admin/story-detail/${id}`);
	}, []);
	
	
	//delete community
	const handleDeleteStory = useCallback(async()=>{
		setShowConfirm(false);
		if(deleteStoryId == null || authToken == null)
		{
			return;
		}
		try
		{
			 
			//call the   server
			let data = await serverConnection('/delete-stories', {id:deleteStoryId}, authToken);
			console.log(data);
			 
			if(data && data.status)
			{
				  
				dispatch(updateListState({type : 'ItemDelete', deleted_id: deleteStoryId}));
				setsubmitionMSG('Story is deleted successfully.');
					
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the story. Please try again.');
				 
			}
			 
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.');
				 
		}
		finally
		{
			setDeleteStoryId(null);
			setShowModel(true)
		}
		
		  
	}, [authToken, deleteStoryId, setDeleteStoryId]);
	
	
	
  return ( 
		<div className="mt-4 mb-4 sub_main_container p-2 overflow-auto " style={{minHeight:'40vh'}} >
        <Table   bordered     variant="white" className="  m-0    text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th>
              <th>Story</th>
              <th>Posted by</th>
              <th>Comments</th>
              <th>Likes</th> 
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {stories && stories.length > 0 ? (
              stories.map((story, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>
										<div className="btn p-0 border-0 " onClick={()=>moreAboutStory(story.id)} > 
						
											<Image src={story.story_file || '/images/login_icon.png'} 
											className="comment_profile_image"
											onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
											alt={`Story no. ${story.id}"`}
											 loading="lazy"
											/> 
											
										</div>
									</td>
                  <td>
										<Button 
											 variant="light"
											 id={`userProfile${story.user.id}${index}`}
											 title={`Profile of ${story.user.userID}`}
											className="py-0 "
											onClick={()=>{moreAboutUser(story.user.id, story.user.userID)}} 
										>
											{story.user.userID} 
                    </Button> 
									</td>
                  <td>{story.comments_count}</td>
                  <td>{story.likes_count}</td>
                   
                   
									<td>
									
										<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`userAction${story.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
												<Dropdown.Item as="button" variant="*" id={`storyDetail${story.id}`} title={`Story detail "${story.id}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutStory(story.id)}>
													<BsCardText /> <span className="px-2">Detail </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deleteStory${story.id}`} title={`Delete story "${story.name}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeleteStoryId(story.id); setShowConfirm(true); }
													
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
                <td colSpan="6" className="py-4 fw-bold text-danger">No story found  !</td>
              </tr>
            )}
          </tbody>
        </Table>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteStory}
        message="Are you sure you want to delete this story."
        confirmLabel="Delete"
				/>
      </div>
    
  );
};

export default StoryTable;
