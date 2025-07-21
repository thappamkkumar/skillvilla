 
import {memo} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Form from 'react-bootstrap/Form'; 


const UpdateCandidateBasicDetail = ({userData, handleUserDetailUpdate, handleKeyPress }) => { 

	return ( 
		<Row className="p-0  m-0    p-2 ">
			<Col xs={4} sm={4} lg={2} className="  border border-1  py-2  ">
				 <p className="m-0">Mobile Number</p>
			</Col> 
			<Col xs={8} sm={8} lg={4} className="border border-1   py-2 ">
				<Form.Group   controlId="formMobile"   > 
					<Form.Control type="text" defaultValue={userData.mobileNumber}   className=" shadow-none bg-light formInput" name="mobile_number" onBlur={handleUserDetailUpdate} onKeyDown={handleKeyPress} autoComplete="off"  /> 
				</Form.Group>	
			</Col> 
			
			
			<Col xs={4} sm={4} lg={2} className="  border border-1  py-2  ">
				 <p className="m-0">Village/City</p>
			</Col> 
			<Col xs={8} sm={8} lg={4} className="border border-1   py-2 ">
				<Form.Group   controlId="formVillage_City"   > 
					<Form.Control type="text" defaultValue={userData.cityVillage} className=" shadow-none bg-light formInput"  name="city_village" onBlur={handleUserDetailUpdate} onKeyDown={handleKeyPress} autoComplete="off"   /> 
				</Form.Group>	
			</Col> 
			
					
			<Col xs={4} sm={4} lg={2} className="  border border-1  py-2  ">
				 <p className="m-0">State</p>
			</Col> 
			<Col xs={8} sm={8} lg={4} className="border border-1   py-2 ">
				<Form.Group   controlId="formState"   > 
					<Form.Control type="text" defaultValue={userData.state} className=" shadow-none bg-light formInput"  name="state" onBlur={handleUserDetailUpdate} onKeyDown={handleKeyPress} autoComplete="off"  /> 
				</Form.Group>	
			</Col> 
			
					
			<Col xs={4} sm={4} lg={2} className="  border border-1  py-2 ">
				 <p className="m-0">Country</p>
			</Col> 
			<Col xs={8} sm={8} lg={4} className="border border-1   py-2 ">
				<Form.Group   controlId="formCountry"   > 
					<Form.Control type="text" defaultValue={userData.country} className=" shadow-none bg-light formInput"  name="country" onBlur={handleUserDetailUpdate} onKeyDown={handleKeyPress} autoComplete="off"   /> 
				</Form.Group>	
			</Col> 
				
		</Row>
	);
	
};

export default memo(UpdateCandidateBasicDetail);
