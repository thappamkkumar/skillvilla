 
import {memo,} from 'react';   
 
import Post from '../Post/Post'; 

const PostList = ({postList}) => { 
	 
  
	return ( 
		 
			<div className="w-100 px-2 py-0 px-sm-3 px-md-4 px-lg-5     " >
				 
				{postList.map((post) => ( 
						
						<div     key={post.id}  className="   mb-3     ">
							{
								post.deleted != null && post.deleted == true ? (
									<div className=" post  postAttachmentContainer  d-flex align-items-center justify-content-center   rounded  ">
											<h5  >This post is no longer available.</h5>
									</div> 
								) : (
									<Post post={post}   />
								)
							}
							 
						</div>
					))} 
					
			</div>
			
		 
	);
	
};

export default  memo(PostList);



/*import { memo, } from 'react';
import { VariableSizeList as List } from 'react-window';
import Post from '../Post/Post';

const PostList = ({ postList}) => {
   
  // Calculate the height of each item based on screen width and aspect ratio
  const getItemSize = (index) => {
      return window.innerHeight  * 0.75; // Calculate height based on width
  };

  const Row = ({ index, style }) => {
    const post = postList[index];
    return (
      <div style={style} className="p-2 postWrapper">

        {post.deleted ? ( 
          <div className="no_posts_message  post  d-flex align-items-center justify-content-center shadow">
            <h5  >This post is no longer available.</h5>
          </div>
        ) : (
          <Post post={post} />
        )}
      </div>
    );
  };

  return (
	
    <List
		  
      height={window.innerHeight - 50} // Visible height of the list
      itemCount={postList.length}
      itemSize={getItemSize} // Function to calculate item height
      width="100%" 
			 
    >
      {Row}
    </List>
  );
};

export default memo(PostList);
*/