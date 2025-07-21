 
import {memo, useRef,  useState, useCallback} from 'react';
import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';  


const UpdatePassword = ({verifyCurrentPassword, updatePassword, handleKeyPress}) => { 
	const [isCurrentPassword, setIsCurrentPassword]=useState(false);
	//const [newPassword, setNewPassword] = useState('');
	//const [confirmedNewPassword, setConfirmedNewPassword] = useState('');
	
	const currentPasswordRef = useRef('');
	const newPasswordRef = useRef('');
	const confirmNewPasswordRef = useRef('');
	
	//function for getting currrent Password from user input and submit or transfer for verification
	const getPassword = useCallback(async(event)=>{
		let val = event.target.value;
		
			if(val.length > 0)
			{
			 setIsCurrentPassword(await verifyCurrentPassword(val));
			}
			
		
	},[setIsCurrentPassword, verifyCurrentPassword]);
	
	//function for getting new password and call updatePassword
	const callUpdatePassword = useCallback(()=>{
		let newPassword = newPasswordRef.current.value;
		let confirmedNewPassword = confirmNewPasswordRef.current.value;
		
		if(newPassword.length == 0 && confirmedNewPassword.length == 0)
		{
			return;
		}
		updatePassword(newPassword, confirmedNewPassword);
		
	}, [updatePassword]);
	
	return ( 
	
		 
			 
			<Row className="  p-2  m-0    ">
				<Col xs={4} sm={4} lg={2} className=" t border border-1 py-2  ">
				 <p className="m-0">Current Password</p>
				</Col> 
				<Col xs={8} sm={8} lg={10} className="border border-1  py-2 ">
					<Form.Group   controlId="formCurrentPassword"   > 
						<Form.Control type="text" ref={currentPasswordRef}  name="currentPassword"  onBlur={getPassword} onKeyDown={handleKeyPress} className="   shadow-none    bg-light formInput"   autoComplete="off"  /> 
					</Form.Group>	
				</Col> 
				
				<Col xs={4} sm={4} lg={2} className="  border border-1 py-2  ">
				 <p className={`m-0 ${(!isCurrentPassword) && 'text-muted'}`}>New Password</p>
				</Col> 
				<Col xs={8} sm={8} lg={4} className="border border-1  py-2 ">
					<Form.Group   controlId="formNewPassword"   > 
						<Form.Control type="text" ref={newPasswordRef} name="newPassword"  className="   shadow-none     bg-light formInput"   autoComplete="off" readOnly={!isCurrentPassword} /> 
					</Form.Group>	
				</Col> 
				
				<Col xs={4} sm={4} lg={2} className=" border border-1 py-2 ">
				 <p className={`m-0 ${(!isCurrentPassword) && 'text-muted'}`}>Confirm New Password</p>
				</Col> 
				<Col xs={8} sm={8} lg={4} className="border border-1 py-2 ">
					<Form.Group   controlId="formConfirmPassword"   > 
						<Form.Control type="text" ref={confirmNewPasswordRef} name="formConfirmPassword"  className="  shadow-none      bg-light formInput"   autoComplete="off" readOnly={!isCurrentPassword} /> 
					</Form.Group>	
				</Col> 
				
				<Col xs={8} sm={8} lg={4}  className=" py-2   px-0   ">
					<Button variant="*" title="Update password" id="updatePasswordBTN" className="   primaryBTN " onClick={callUpdatePassword} disabled={!isCurrentPassword} >Update Password</Button>
				</Col> 
						
				
			</Row>	
		 
	);
	
};

export default memo(UpdatePassword);
