// resources/js/components/Others/CloseButton.jsx
 
import React  from 'react';  
  
import Button from 'react-bootstrap/Button';   
import { BsX } from 'react-icons/bs'; 
const CloseButton = ({removePostDetailContent, styleClass, variant}) =>
{   
	return(
		<Button variant={variant} type="button" onClick={removePostDetailContent} className= {` ${styleClass}`} id="closeBUTTON" title="close"><BsX className="  fw-bold fs-3 " /></Button>
	);

};

export default CloseButton;