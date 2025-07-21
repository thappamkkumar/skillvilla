import { memo, useCallback, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Comment from '../PostComment/Comment/Comment';
import LoadMoreButton from '../../Common/LoadMoreButton';
import serverConnection from '../../../CustomHook/serverConnection';

const StoryDetailReviewList = ({
    storyId,
		storyUserId,
    loggedUserId, 
		authToken,
    storyComments,
    setStoryComments,
    cursorComment,
    setCursorComment,
    hasMoreComment,
    setHasMoreComment,
    commentLoading,
    setCommentLoading,
}) => {
	
		// Fetch story comments API
    const apiCallForStoryComments = useCallback(async () => {
        if (!storyId || !authToken) return;

        try {
            setCommentLoading(true); 
						
            const requestData = { story_id: storyId, user_id: loggedUserId};
            const url = `/get-stories-comments?cursor=${cursorComment}`;

            const data = await serverConnection(url, requestData, authToken);
						
            if (data?.storyComment) {
                setStoryComments((prev) => [...prev, ...data.storyComment.data]);
                setCursorComment(data.storyComment.next_cursor);
                setHasMoreComment(Boolean(data.storyComment.next_cursor));
            }
        } catch (error) {
            console.error('Error fetching story comments:', error);
        } finally {
            setCommentLoading(false);
        }
    }, [authToken, storyId, loggedUserId, cursorComment, setStoryComments, setCursorComment, setHasMoreComment, setCommentLoading]);

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source();
			 	 
		  apiCallForStoryComments( ); 
		
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, storyId ]);



    if (!commentLoading && (!storyComments || storyComments.length === 0)) {
        return (
            <div className="w-100 py-4">
                <p className="no_posts_message post">No comment submitted yet.</p>
            </div>
        );
    }

    return (
        <div className="py-3">
            <h4 className="px-2">
							{
								(storyUserId == loggedUserId)
								?(
									'Comments'
								):(
									'Your Comments'
								)
							}
							 
						</h4>
            {storyComments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}

            {commentLoading && (
                <div className="py-3 text-center">
                    <Spinner animation="border" />
                </div>
            )}

            {hasMoreComment && !commentLoading && (
                <LoadMoreButton apiCall={apiCallForStoryComments} loading={commentLoading} />
            )}
        </div>
    );
};

export default memo(StoryDetailReviewList);
