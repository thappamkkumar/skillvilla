 
import {memo    } from 'react';  

const PostDetailCategory= ({postID, categories}) => { 
 
	
	return ( 
		<div className="d-flex gap-2 flex-wrap" >
			 { categories.map((category, index)=>(
							 
							<span key={`${postID}-${index}-${category}`} className=" fs-6  p-1 px-2   rounded tech_skill">
								
								{category}
								 
								 
							</span>
						))
					} 
		</div>
	);
	
};

export default memo(PostDetailCategory);
