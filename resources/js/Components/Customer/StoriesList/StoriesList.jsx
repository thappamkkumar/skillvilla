 
import {memo} from 'react';   
import  ListGroup from 'react-bootstrap/ListGroup';  

import Stories from '../Stories/Stories';  

const StoriesList = ({storiesList, }) => { 
	
	
  
	return ( 
		 
			<ListGroup  className="p-0  pb-5 rounded-0 mx-auto "   style={{overflow:'hidden', }}>
							
				 
				{storiesList.map((stories) => ( 
						
						
						
						<ListGroup.Item   key={stories.id}     id={`stories_${stories.id}`}   className={`${(stories.deleted != null && stories.deleted == true)&&('no_posts_message pt-3 pb-2')} customListGroup rounded-0 border-0  p-0 `}>
						
						{
								stories.deleted != null && stories.deleted == true ? (
									 
										<h5 className="">This story is no longer available.</h5>
									 
									  
								) : (
									<>
									 
										<Stories stories={stories} />
									 
									 
									</>
								)
						}
						 
						
								 
							 
						</ListGroup.Item>
					))} 
					
			</ListGroup>
			
		 
	);
	
};

export default  memo(StoriesList);
