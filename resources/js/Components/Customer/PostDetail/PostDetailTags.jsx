 
import {memo    } from 'react';  

const PostDetailTags = ({postID, tags}) => { 
 
	
	return ( 
		<div className="d-flex gap-2 flex-wrap" >
			 { tags.map((tag, index)=>(
							 
							<span key={`${postID}-${index}-${tag}`} className=" fs-6  p-1 px-2   rounded tech_skill">
								
								{tag}
								 
								 
							</span>
						))
					} 
		</div>
	);
	
};

export default memo(PostDetailTags);
