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
 
const PostTable = ({ posts }) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false); 
	const [deletePostId, setDeletePostId] = useState(null); 
	
	const navigate = useNavigate(); 
	const dispatch = useDispatch();
	
	 


	//navigate to user  profile
	const moreAboutCreator= useCallback((id, userId)=>{
		//manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);
	
	
		//navigate to post detail
	const moreAboutPost = useCallback((id,)=>{
		//manageVisitedUrl(`/admin/post-detail/${id}`, 'append');
		navigate(`/admin/post-detail/${id}`);
	}, []);
	
	
	//delete post
	const handleDeletePost = useCallback(async()=>{
		setShowConfirm(false);
		if(deletePostId == null || authToken == null)
		{
			return;
		}
		try
		{
			 
			//call the   server
			let data = await serverConnection('/delete-post', {postId:deletePostId}, authToken);
			//console.log(data);
			 
			if(data.status)
			{
				  
				dispatch(updateListState({type : 'ItemDelete', deleted_id: deletePostId}));
				setsubmitionMSG('Post is deleted successfully.');
					
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the post. Please try again.');
				 
			}
			 
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.');
				 
		}
		finally
		{
			setDeletePostId(null); 
			setShowModel(true)
		}
		
		 
		
	}, [authToken, deletePostId, setDeletePostId]);
	
	
	
  return ( 
		<div className="mt-4 mb-4 sub_main_container p-2 overflow-auto " style={{minHeight:'40vh'}} >
        <Table   bordered     variant="white" className="  m-0    text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th>
              <th>Post</th>
              <th>Post By</th>
              <th>Total Likes</th>
              <th>Total Comments</th> 
              <th>Posted</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>
										<div className="btn p-0 border-0 " onClick={()=>moreAboutPost(post.id)} > 
						
											<Image src={post?.attachment || '/images/login_icon.png'} 
											className="comment_profile_image"
											onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
											  loading="lazy"
											alt={`Image of post ${post.id}"`}/> 
											
										</div>
									</td>
                  <td>
										<Button 
											 variant="light"
											 id={`userProfile${post.user.id}`}
											 title={`Profile of ${post.user.userID}`}
											className="py-0 "
											onClick={()=>{moreAboutCreator(post.user.id, post.user.userID)}} 
										>
											{post.user.userID} 
                    </Button>
									</td>
                  
                  <td>{post.likes_count}</td>
                  <td>{post.comments_count}</td>
                  <td>{post.created_at_formated}</td>
                   
									<td>
									
										<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`userAction${post.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
												<Dropdown.Item as="button" variant="*" id={`postDetail${post.id}`} title={`Post detail "${post.id}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutPost(post.id)}>
													<BsCardText /> <span className="px-2">Detail </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deletePost${post.id}`} title={`Delete post "${post.id}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeletePostId(post.id); setShowConfirm(true); }
													
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
                <td colSpan="6" className="py-4 fw-bold text-danger">No post found!</td>
              </tr>
            )}
          </tbody>
        </Table>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeletePost}
        message="Are you sure you want to delete this post."
        confirmLabel="Delete"
				/>
      </div>
    
  );
};

export default PostTable;
