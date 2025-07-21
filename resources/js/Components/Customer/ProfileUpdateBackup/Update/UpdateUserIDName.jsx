 
import {memo} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form'; 


const UpdateUserIDName = ({userData, handleUserDetailUpdate, handleKeyPress}) => { 

	return ( 
		<Row className="  p-2 mb-3 m-0  ">
			<Col xs={4} sm={4} lg={2} className="  border border-1 py-2  ">
			 <p className="m-0">User Id</p>
			</Col> 
			<Col xs={8} sm={8} lg={4}  className="border border-1 py-2 ">
				<Form.Group   controlId="formUserID"   > 
					<Form.Control type="text"   defaultValue={userData.userID} className="shadow-none bg-light formInput" name="userID" onBlur={handleUserDetailUpdate} onKeyDown={handleKeyPress} autoComplete="off" /> 
				</Form.Group>	
			</Col> 
			
			<Col xs={4} sm={4} lg={2} className=" border border-1 py-2  ">
						<p className="m-0">Name</p>
				</Col> 
				<Col xs={8} sm={8} lg={4} className="border border-1  py-2 ">
					<Form.Group   controlId="formName"   > 
						<Form.Control   type="text"  defaultValue={userData.name}  className="shadow-none bg-light formInput"  name="name" onBlur={handleUserDetailUpdate} onKeyDown={handleKeyPress} autoComplete="off"  /> 
					</Form.Group>	
				</Col> 
		</Row>
	);
	
};

export default memo(UpdateUserIDName);
