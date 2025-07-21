import { memo,  useCallback } from 'react';
import { useSelector } from 'react-redux';
 
import StoryDetailReviewInput from './StoryDetailReviewInput';
import StoryDetailReviewCount from './StoryDetailReviewCount';
import StoryDetailReviewList from './StoryDetailReviewList';

const StoryDetailReview = ({
	 
    story,
    updateStoryLikeCount = () => {},
    updateStoryLike = () => {},
    updateStoryCommentCount = () => {},
		storyComments,
		cursorComment,
		hasMoreComment,
		commentLoading,
		setStoryComments,
		setCursorComment,
		setHasMoreComment,
		setCommentLoading,
		  
}) => {
    
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
   const authToken = useSelector((state) => state.auth.token); // selecting token from store
    
    
	 



    const addNewComment = useCallback((newComment) => {
        setStoryComments((prev) => [newComment, ...prev]);
    },[]);

    return (
        <> 
            <StoryDetailReviewInput
                storyId={story.id}
                userLiked={story.has_liked}
                updateStoryLikeCount={updateStoryLikeCount}
                updateStoryLike={updateStoryLike}
                updateStoryCommentCount={updateStoryCommentCount}
                addNewComment={addNewComment}
            />
						{
							(story.user_id == loggedUserData.id )
							&&
							(
									<StoryDetailReviewCount
										likeCount={story.likes_count}
										commentCount={story.comments_count}
									/>
								)
						}
            <StoryDetailReviewList 
                storyId={story.id}
                storyUserId={story.user_id}
								loggedUserId={loggedUserData.id}
								authToken={authToken}
                storyComments={storyComments}
                setStoryComments={setStoryComments}
                cursorComment={cursorComment}
                setCursorComment={setCursorComment}
                hasMoreComment={hasMoreComment}
                setHasMoreComment={setHasMoreComment}
                commentLoading={commentLoading}
                setCommentLoading={setCommentLoading}
            />
						
						
        </>
    );
};

export default memo(StoryDetailReview);
