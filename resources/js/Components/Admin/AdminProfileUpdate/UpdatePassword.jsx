 
import {memo, useRef,  useState, useCallback} from 'react';
import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';  


const UpdatePassword = ({verifyCurrentPassword, updatePassword, handleKeyPress}) => { 
	const [isCurrentPassword, setIsCurrentPassword]=useState(false);
	const [currentPasswordVerifing, setCurrentPasswordVerifing]=useState(false);
	const [currentPasswordVerificatied, setCurrentPasswordVerified]=useState({
		 
	});
	 
	const currentPasswordRef = useRef('');
	const newPasswordRef = useRef('');
	const confirmNewPasswordRef = useRef('');
	
	//function for getting currrent Password from user input and submit or transfer for verification
	const getPassword = useCallback(async (event)=>{
		let val = event.target.value.trim();
			 
			if(val.length > 0)
			{
				setCurrentPasswordVerifing(true);
				const result = await verifyCurrentPassword(val); 
				setIsCurrentPassword(result);
				setCurrentPasswordVerifing(false);
				if(result)
				{
					setCurrentPasswordVerified({status: true, message:'Password Verified.'});
				}
				else
				{ 
					setCurrentPasswordVerified({status: false, message:'Wrong Password.'}); 
				}
			}
			
		
	},[setIsCurrentPassword, verifyCurrentPassword]);
	
	//function for getting new password and call updatePassword
	const callUpdatePassword = useCallback(()=>{
		let newPassword = newPasswordRef.current.value.trim();
		let confirmedNewPassword = confirmNewPasswordRef.current.value.trim();
		
		if(newPassword.length == 0 && confirmedNewPassword.length == 0)
		{
			return;
		}
		updatePassword(newPassword, confirmedNewPassword);
		
	}, [updatePassword]);
	
	return (
    <Row className="p-0 m-0    ">
      {/* Current Password */}
      <Col xs={12} sm={12} lg={12} className="  p-3">
        <Form.Group controlId="formCurrentPassword">
          <Form.Label>
            <strong className="text-muted">Current Password</strong>
          </Form.Label>
          <Form.Control
            type="password"
            ref={currentPasswordRef} 
						name="currentPassword" 
						onBlur={getPassword}
						onKeyDown={handleKeyPress}
            className="shadow-none bg-light formInput"
            autoComplete="off"
          />
					
					{ currentPasswordVerifing && <span  className="text-secondary">Verifing Current Password...</span>}
					
					{ !currentPasswordVerifing && 
						<span 
						className={`text-${currentPasswordVerificatied?.status ? 'success' : 'danger'}`}

						>
						{currentPasswordVerificatied.message}
						</span> 
					}
					 
					
					
        </Form.Group>
      </Col>

      {/* New Password */}
      <Col xs={12} sm={6} lg={6} className="  p-3">
        <Form.Group controlId="formNewPassword">
          <Form.Label>
            <strong className="text-muted  ">New Password</strong>
          </Form.Label>
          <Form.Control
            type="text"
            ref={newPasswordRef}
						name="newPassword" 
            className="shadow-none bg-light formInput"
            autoComplete="off"
            readOnly={!isCurrentPassword}
          />
        </Form.Group>
      </Col>

      {/* Confirm New Password */}
      <Col xs={12} sm={6} lg={6} className=" p-3">
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>
            <strong className= "text-muted" >Confirm New Password</strong>
          </Form.Label>
          <Form.Control
            type="text"
            ref={confirmNewPasswordRef}
            name="formConfirmPassword"
            className="shadow-none bg-light formInput"
            autoComplete="off"
            readOnly={!isCurrentPassword}
          />
        </Form.Group>
      </Col>

      {/* Update Password Button */}
      <Col  xs={12} sm={6} lg={6} className="  p-3 text-center">
        <Button
          variant="dark"
          title="Update password"
					id="updatePasswordBTN" className="w-100  "
					onClick={callUpdatePassword}
					disabled={!isCurrentPassword}
        >
          Update Password
        </Button>
      </Col>
    </Row>
  );
	
};

export default memo(UpdatePassword);
