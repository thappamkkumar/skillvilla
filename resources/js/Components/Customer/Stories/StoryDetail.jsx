 
import {   memo, useCallback, useState  } from 'react';  
import   Button  from 'react-bootstrap/Button'; 
import {  BsChevronCompactLeft, BsChevronCompactRight   } from 'react-icons/bs';
   
import StoryDetailFile from './StoryDetailFile'; 
import StoryDetailReview from './StoryDetailReview'; 
import useStoryDetailWebsockets from './storyWebsocket/useStoryDetailWebsockets'; 


const StoryDetail = ({
	stories,
	setStories,
	index,
	setIndex, 
	
  }) => { 
	 
	 const [storyComments, setStoryComments] = useState([]);
    const [cursorComment, setCursorComment] = useState(null);
    const [hasMoreComment, setHasMoreComment] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

 	
  //change story slide
 const changeStorySlide = useCallback(
  (slide) => {
    setIndex((prevIndex) => {
      if (slide === 'prev') {
        return Math.max(0, prevIndex - 1);  
      } else if (slide === 'next') {
        return Math.min(stories.length - 1, prevIndex + 1);   
      }
      return prevIndex;  
    });
		setStoryComments([]);
		setCursorComment(null);
		setHasMoreComment(false);
		
  },
  [stories.length]  
);

//update story add new comment  
const addNewComment = useCallback((newComment)=>{
		setStoryComments((prev) => ([
				newComment,
        ...prev
    ]));
		 
	},[ ]);
//update story comment counts
	const updateStoryCommentCount = useCallback((comments_count)=>{ 
		setStories((prevStories) =>
      prevStories.map((story, idx) =>
        idx === index ? { ...story, comments_count } : story
      )
    );
	},[ index, setStories]);
	//update story like counts
	const updateStoryLikeCount = useCallback(
  (likes_count) => {
    setStories((prevStories) =>
      prevStories.map((story, idx) =>
        idx === index ? { ...story, likes_count } : story
      )
    );
  },
  [index, setStories]
);
//update story lik
const updateStoryLike = useCallback(
  (liked) => {
    setStories((prevStories) =>
      prevStories.map((story, idx) =>
        idx === index ? { ...story, has_liked: liked } : story
      )
    );
  },
  [index, setStories]
);

 // Call the useStoryDetailWebsockets hook for websockets event listeners 
useStoryDetailWebsockets(
	stories[index].id,
	stories[index].user_id,
	updateStoryLikeCount,
	updateStoryCommentCount,
	addNewComment,
	);
	
	return ( 
		<>	 
				 
			<div className="   postDetailAttachmentContainer  " >
			
				
				{
					stories[index] != null && stories[index].deleted != null && stories[index].deleted == true ? (
							<div className="  d-flex align-items-center storyDetailDeleteMsgContainer" >
								<p className="  mx-auto w-auto">This Story is no longer available.</p>
							</div>
						):(
							 
								<StoryDetailFile 
								storyId={stories[index].id}
								file={stories[index].story_file} 
								type={stories[index].story_file_type} 
								/> 
								
								
						)
				}
				
				{
					index > 0 && <Button variant="*"	onClick={()=>{changeStorySlide('prev');}} className="fs-3 py-3 px-1 mx-2 postDetailVideoControllerBtn"	id="postDetailVideoController-PrevBtn" title="Previous"><BsChevronCompactLeft  style={{ strokeWidth: '1', }} /></Button>
				}
				{
					index < stories.length-1 && <Button variant="*"	onClick={()=>{changeStorySlide('next');}} className="fs-3 py-3 px-1 mx-2 postDetailVideoControllerBtn"	id="postDetailVideoController-NextBtn" title="Next"><BsChevronCompactRight  style={{ strokeWidth: '1', }} /></Button>
				}
			
					
			</div>    
			{
				stories[index] != null && stories[index].deleted != null && stories[index].deleted == true ?(<></>): (
				
						<StoryDetailReview  
							 
							story={stories[index]} 
							updateStoryLikeCount={updateStoryLikeCount} 
							updateStoryLike={updateStoryLike} 
							updateStoryCommentCount={updateStoryCommentCount}
							storyComments={storyComments}
							cursorComment={cursorComment}
							hasMoreComment={hasMoreComment}
							commentLoading={commentLoading}
							setStoryComments={setStoryComments}
							setCursorComment={setCursorComment}
							setHasMoreComment={setHasMoreComment}
							setCommentLoading={setCommentLoading}
							
							
							/>
				)
			}
			
		</> 
	);
	
};

export default  memo(StoryDetail);
