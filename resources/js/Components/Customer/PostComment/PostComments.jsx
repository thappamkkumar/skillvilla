import  {memo, useCallback, useEffect, useState, useRef }   from 'react';
import {useDispatch, useSelector } from 'react-redux';  
import { updateCommentState } from '../../../StoreWrapper/Slice/CommentSlice'; 

import Spinner from 'react-bootstrap/Spinner'; 
import Offcanvas from 'react-bootstrap/Offcanvas'; 
import Button from 'react-bootstrap/Button'; 
import Card from 'react-bootstrap/Card'; 
import  Row  from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import { BsX} from 'react-icons/bs';

import Comment from './Comment/Comment'; 
import PostCommentInput from './PostCommentInput'; 
import LoadMoreButton from '../../Common/LoadMoreButton'; 
 
import serverConnection from '../../../CustomHook/serverConnection';

const PostComments = ( {updatePostDetailCommentCount = ()=>{},}) =>
{
	const commentList = useSelector((state) => state.commentList); //selecting comment state from store 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const [loading, setLoading] = useState(true);
	const scrollRef = useRef(null);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
	//function for handle comment box close
	const handleCommentBox = useCallback(() =>
	{  
		dispatch(updateCommentState({type : 'refresh' }));
			 
	},[dispatch]);
	
	
 	
//websocket connection for update comment list or new comment add in list
	const postNewComment_webSocketChannel = `post-comments`; 
	const postNewComment_connectWebSocket = () => {
			window.Echo.channel(postNewComment_webSocketChannel)
					.listen('PostCommentEvent', async (e) => {
							// e.message  
							let newComment = e.postComment.addedComment; 
							//console.log(newComment);
							if(loggedUserData != null && loggedUserData.id == newComment.user_id)
							{
								return;
							}							
						  
							dispatch(updateCommentState({type : 'SetNewComment', newComment: newComment}));
					}); 
	};
	useEffect(() => {  
		 postNewComment_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(postNewComment_webSocketChannel);
    };
	}, [ ]); // Call the effect only once on component mount

 
	
	const apiCall = useCallback(async()=>{ 
		try
		{	
			setLoading(true);
			 
			let passData = {
				post_id:commentList.postID, 
			};  
			//call the function fetcg post data fron server
			let getData = await serverConnection(`/get-post-comment?cursor=${commentList.cursor}`,passData, authToken);  
			 
			//update the post state in redux.
			dispatch(updateCommentState({type : 'SetComments', commentList: getData.commentList.data}));
			dispatch(updateCommentState({type : 'SetCursor', cursor: getData.commentList.next_cursor})); 
			dispatch(updateCommentState({type : 'SetHasMore', hasMore: getData.commentList.next_cursor != null})); 
			setLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoading(false);
		}
		 
	}, [dispatch, commentList.cursor, commentList.postID]);
	
	useEffect(() => { 
		// Create a cancel token source
		let source = axios.CancelToken.source();   
		 
			apiCall(); 
		 
		return () => {
			setLoading(false);
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, []);
	
	//function use to handle fetch more data or comment
	const fetchMoreData = useCallback(() => {
    if (scrollRef.current) {
		 
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading &&  commentList.hasMore) 
			{	 
				apiCall(); 
      }
    }
  }, [loading]);
	useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', fetchMoreData);
      return () => ref.removeEventListener('scroll', fetchMoreData);
    }
  }, [fetchMoreData]);	
	
	
	return(
	 
		<Offcanvas  placement="bottom"  show={commentList.commentStatus} onHide={handleCommentBox} className=" bg-white rounded  comment_box_main_Container  " style={{  left:'50%',transform: 'translateX(-50%)', height:'98vh'}} >
					
				<Offcanvas.Body className="p-0" style={{  overflowY: "hidden"}} >
					<Card className="w-100 h-100 border-0">
					
						<Card.Header className="bg-white  d-flex flex-wrap justify-content-between">
							<h4>Comments</h4>
							<Button variant="outline-dark" className=" p-1   border-2 border-dark  " onClick={handleCommentBox}  id={`commentSectionCloseButton${commentList.postID}`} title="Close Comments"  ><BsX className="  fw-bold fs-3 " /></Button>
						</Card.Header>
						
						<Card.Body ref={scrollRef} className="w-100 p-0 mx-auto main_container"   >
							
							{commentList.commentList?.map((comment, index) => (
									<Comment key={comment.id} comment={comment} />
							))}
							
							{loading && <div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>}	 
							 
							{commentList.hasMore && !loading && (
									<LoadMoreButton apiCall={apiCall}  loading={loading} />
								)}
													 
							{
								(!commentList.hasMore && !loading) && 
								<div className="text-center py-3" style={{ color: '#6c757d', fontStyle: 'italic' }}>
									<p>
										<span>No comment submitted yet.</span>
									</p>
								</div> 
							}
								
						</Card.Body>
						
						<Card.Footer className="p-0  shadow ">
							<PostCommentInput  updatePostDetailCommentCount={updatePostDetailCommentCount} />
						</Card.Footer>
					</Card> 
					
				</Offcanvas.Body> 
			</Offcanvas>
	
	);
};

export default memo(PostComments);
