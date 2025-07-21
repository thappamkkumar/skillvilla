 
import {memo} from 'react';  

const PostDescription= ({description}) => { 

	 
	
	return ( 
		<div className="p-0 bg-danger">
			{description}
			
		</div>
	);
	
};

export default memo(PostDescription);
