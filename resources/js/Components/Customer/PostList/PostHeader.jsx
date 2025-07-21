  import   {memo, useCallback}  from 'react';
import { useNavigate } from 'react-router-dom';  
import {useDispatch } from 'react-redux'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button'; 
import { BsThreeDotsVertical ,   BsTag, BsBookmarkCheck, BsCardList  } from "react-icons/bs";  

import { updatePostState as updateTaggedSavedPostState} from '../../../StoreWrapper/Slice/TaggedSavedPostSlice'; 
import { updatePostState as updateMyPostState } from '../../../StoreWrapper/Slice/MyPostSlice'; 

 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const PostHeader = ({heading = 'Posts', myPost=false}) => { 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	

	//function use to handle navigation to upload new post 
	/*const handleNavigateToUploadPost = useCallback(()=>{
		 
		manageVisitedUrl(`/posts/add-new`, 'append'); 
		navigate('/posts/add-new');
	}, []);*/
	
	
	
	//function use to handle navigation to tagged post list
	const handleNavigateToTaggedPost = useCallback(()=>{ 
		dispatch(updateTaggedSavedPostState({type : 'refresh'}));  
		//manageVisitedUrl('/posts/tagged', 'append'); 
		navigate('/posts/tagged');
	}, []);
	 //function use to handle navigation to saved post list
	const handleNavigateToSavedPost = useCallback(()=>{ 
		dispatch(updateTaggedSavedPostState({type : 'refresh'}));  
		//manageVisitedUrl('/posts/saved', 'append'); 
		navigate('/posts/saved');
	}, []);
	  //function use to handle navigation to saved post list
	const handleNavigateToFollowingPost = useCallback(()=>{ 
		dispatch(updateMyPostState({type : 'refresh'}));
		 
	//	manageVisitedUrl('/posts/my-posts', 'append');
		navigate('/posts/my-posts');		
		 
	}, []);
  
	return ( 
	 <div className=" d-flex gap-2 justify-content-between align-items-start  px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<h3 className="fw-bold  ">{heading} </h3>
			
				
				
				<Dropdown  >
					 <Dropdown.Toggle variant="light" id="postPageDropDownMenu" className="  custom_dropdown_toggle_post_header  fs-5 px-2 pt-0 pb-1  "   > 
							<BsThreeDotsVertical  />
						</Dropdown.Toggle>
					 
					 
					<Dropdown.Menu className="  border-0 p-2  dropdown_menu shadow" style={{overflow:'hidden',}}>
					 
					 {/*<Dropdown.Item as="button" variant="*" id="addNewPostBtn" title="Upload new post"  className="py-2  rounded d-flex align-items-center gap-2    navigation_link" onClick={handleNavigateToUploadPost}><BsPlusSquare /> <span className="px-2">New Post </span></Dropdown.Item>
					 */}
					 
							{
								!myPost &&
								<Dropdown.Item as="button" variant="*" id="myPostBtn" title="My posts"  className="py-2 rounded d-flex align-items-center gap-2   navigation_link" onClick={handleNavigateToFollowingPost}><BsCardList  /> <span className="px-2">My Posts </span></Dropdown.Item>
							} 
							<Dropdown.Item as="button" variant="*" id="taggedPostBtn" title="Tagged post"  className="py-2  rounded d-flex align-items-center gap-2   navigation_link" onClick={handleNavigateToTaggedPost}><BsTag /> <span className="px-2">Tagged Posts</span></Dropdown.Item>
							<Dropdown.Item as="button" variant="*" id="savedPostBtn" title="Saved post"  className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={handleNavigateToSavedPost}><BsBookmarkCheck /> <span className="px-2">Saved Posts</span></Dropdown.Item>
						 
					</Dropdown.Menu>
				</Dropdown>
			 
			
			
			
		</div>
	);
};

export default memo(PostHeader);