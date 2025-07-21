 
import {memo, useRef,  useState, useCallback} from 'react';
import Form from 'react-bootstrap/Form'; 
import InputGroup from 'react-bootstrap/InputGroup'; 
import Button from 'react-bootstrap/Button'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';  
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';


const UpdatePassword = ({verifyCurrentPassword, updatePassword, handleKeyPress}) => { 
	const [isCurrentPassword, setIsCurrentPassword]=useState(false);
	const [currentPasswordVerifing, setCurrentPasswordVerifing]=useState(false);
	const [currentPasswordVerificatied, setCurrentPasswordVerified]=useState({ });
	const [showPassword, setShowPassword] = useState(false); //store password is hide or show
 
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
	
	
	
	 	//handle password hide and show
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(showPassword => !showPassword);
  }, []);
	
	
	
	
	return (
    <Row className="p-0 m-0  ">
      {/* Current Password */}
      <Col xs={12} sm={12} lg={12} className="  p-3">
        <Form.Group controlId="formCurrentPassword">
          <Form.Label>
            <strong className="text-muted">Current Password</strong>
          </Form.Label>
					<InputGroup  >
						<Form.Control 
						type={showPassword ? 'text' : 'password'} 
						ref={currentPasswordRef} 
						name="currentPassword" 
						onBlur={getPassword}
						onKeyDown={handleKeyPress}
            className="shadow-none rounded bg-light formInput"
						autoComplete={showPassword ? 'off' : 'password'} 
						 />
						
						{newPasswordRef?.current !=  '' && (
							<Button variant=" " className="py-0 rounded" style={{ position: 'absolute', right: '3px', top: '4px', height: '30px', zIndex: '6', background:'#fff'}} onClick={togglePasswordVisibility}>
								{showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
							</Button>
						)}
						 
					</InputGroup>
					 
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
      <Col xs={12} sm={6} lg={6} className="  p-3">
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
      <Col xs={12} sm={6} lg={6} className="  p-3  ">
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
