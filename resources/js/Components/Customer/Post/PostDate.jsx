 
import React, {memo} from 'react';    
 
const PostDate= ({postDate}) => { 
		  
	return ( 
		<div className="w-100 h-auto    text-end   ">
			<small className="text-muted   ">{postDate}</small>
		</div>
	);
	
};

export default memo(PostDate);
