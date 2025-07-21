import { memo }  from 'react';
import { useSelector } from 'react-redux';  
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Post from '../../../Components/Customer/ExplorePost/Post';   
import PostComments from '../../../Components/Customer/PostComment/PostComments'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)



const ExplorePostPage = () => {
   const postList = useSelector((state) => state.postList);  // Selecting post list from store
  const commentStatus = useSelector((state) => state.commentList.commentStatus); //selecting token from store
  return (
		<>
			<PageSeo 
				title="Explore Posts | SkillVilla"
				description="Engage with trending posts, project updates, ideas, and announcements from professionals across industries."
				keywords="posts, explore posts, announcements, project updates, ideas, professional content"
			/>

			<Row className="w-100 mx-auto  px-0 py-0 px-sm-3 px-md-4 px-lg-5">
        {postList.postList.map((post) => (
          <Col xs={6} sm={6} md={4} lg={3} key={post.id} className="  m-0 p-2">
            {/* Display each post inside a column */}
            <div className="  ">
              
               <Post post={post} />  
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

export default memo(ExplorePostPage);
