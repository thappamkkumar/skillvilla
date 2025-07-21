// resources/js/components/Others/CloseButton.jsx
 
import React  from 'react';  
  
import Button from 'react-bootstrap/Button'; 

const LoadMoreButton = ({apiCall, loading}) =>
{   
	return(
		<div className="w-100  text-center">
			<Button variant="outline-dark" id="loadMoreDataBTN" title="Load More" className="my-3 border border-2 border-dark    " onClick={apiCall} disabled={loading}>
			Load More
			</Button>
		</div>
	);

};

export default LoadMoreButton;