 
import  {   memo} from 'react'; 
 

const PostLikeCommentCount= ({  postCountData, }) => {
	
	 
	
	 
	
	
	
	
	return ( 
		 <div className="d-flex    flex-wrap justify-content-start px-0  py-1 text-secondary  ">
				 
					<small className="me-2">{postCountData.totalLikes} likes</small> 
				 
					<small  >{postCountData.totalComments} comments</small> 
				 
				
			</div>
	 
	);
	
};

export default memo(PostLikeCommentCount);
