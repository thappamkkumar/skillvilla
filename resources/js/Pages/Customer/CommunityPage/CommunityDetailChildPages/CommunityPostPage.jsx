import { memo }  from 'react';
import { useSelector } from 'react-redux';  
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sender from '../../../../Components/Customer/CommunityDetail/Sender';   
import Post from '../../../../Components/Customer/ExplorePost/Post';   
import PostComments from '../../../../Components/Customer/PostComment/PostComments'; 

const CommunityPostPage = () => {
   const postList = useSelector((state) => state.taggedSavedPostList);  // Selecting post list from store
  const commentStatus = useSelector((state) => state.commentList.commentStatus); //selecting token from store
  return (
		<>
     <Row className="w-100 mx-auto  px-0 py-0 px-sm-3 px-md-4 px-lg-5  ">
        {postList.postList.map((post, index) => (
          <Col xs={6} sm={6} md={4} lg={3} key={index} className="  m-0 p-2">
            {/* Display each post inside a column */}
            <div className="  ">
              			
              <Post post={post}  />
							<Sender 
								user={post.sender} 
								style="d-flex      my-2       "
							/>				 
            </div>
          </Col>
        ))}
      </Row>
			{
				commentStatus && <PostComments />
			}
		</>
  );
};

export default memo(CommunityPostPage);
