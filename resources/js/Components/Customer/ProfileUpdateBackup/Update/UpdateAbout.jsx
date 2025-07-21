 
import {memo} from 'react';
import Form from 'react-bootstrap/Form'; 


const UpdateAbout = ({about, handleUserDetailUpdate, handleKeyPress}) => { 

	return ( 
		<section className="p-3">
			<h4 >About</h4>
				<Form.Group   controlId="formAbout"   > 
					<Form.Control as="textarea" rows={10} defaultValue={about} className=" shadow-none   bg-light p-2  formInput" name="about" onBlur={handleUserDetailUpdate} onKeyDown={handleKeyPress}   /> 
				</Form.Group>
				
		</section>
	);
	
};

export default memo(UpdateAbout);
