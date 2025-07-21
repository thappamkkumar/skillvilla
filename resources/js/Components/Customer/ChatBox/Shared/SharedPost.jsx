import {  memo,    }  from 'react';    
import Post from '../../Post/Post'; 
import { BsLink45Deg } from "react-icons/bs";
const SharedPost = ({post}) => {

   
	
	
  return (
	<div className="   w-100 mb-2"  >
		
		<Post post={post}  chatBox={true} />
		<small className="text-secondary fw-bold"> <BsLink45Deg /> Post</small>
		
	</div>
  );
};

export default memo(SharedPost);
