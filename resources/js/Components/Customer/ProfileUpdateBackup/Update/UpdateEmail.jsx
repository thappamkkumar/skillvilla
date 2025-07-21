 
import {memo} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'; 


const UpdateEmail = ({ otp, email, getEnteredEmail, sendOTP, reSendOTP, getEnteredOTP, VerifyOTP }) => { 

	return ( 
		<Row className= " p-2  m-0 mb-3    " >
				<Col xs={4} sm={4} lg={2} className="py-2   border border-1      " >
				 <p className="m-0">Email</p>
				</Col> 
				<Col xs={8} sm={8} lg={6}  className="py-2   border border-1      " > 
					
					 <Form.Group   controlId="formEmail"> 
						<InputGroup className="border-0  ">
							<Form.Control type="email"  defaultValue={email} className=" shadow-none bg-light formInput"  name="email" onChange={getEnteredEmail} autoComplete="off"   />
							{otp.status == false && (
								<Button variant="*" title="send otp" id="sendOTP" className="rounded-0 primaryBTN" onClick={sendOTP}>{reSendOTP == true && 'Re-'}Send OTP </Button>
							)}
							 
						</InputGroup>
					</Form.Group>
				</Col> 
				{otp.status == true && (
				<Col  xs={12} sm={12} lg={4}    className=" py-2 border border-1">
					<Form.Group   controlId="formOTP"> 
						<InputGroup className="border-0  ">
							<Form.Control type="number"  placeholder="Enter OTP" className=" shadow-none bg-light formInput "  name="otp" onChange={getEnteredOTP} autoComplete="off"   />
							 
							<Button variant="*" title="verify otp and update email" id="verifyOTP" className="rounded-0 primaryBTN" onClick={VerifyOTP}>Verify OTP </Button>
								
						</InputGroup>
					</Form.Group>
				</Col> 
				)}
				
			</Row> 
	);
	
};

export default memo(UpdateEmail);
