import {memo, useState, useMemo, useCallback}from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup  } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import MessageAlert from '../../MessageAlert';
 

const SignUpPasswordVerification = ({ signUpData, setSignUpData, setStep   }) => {
 const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [storing, setStoring] = useState(false);
	const [stored, setStored] = useState(false);
	const [showPassword, setShowPassword] = useState(false); //store password is hide or show
 
 
 	const navigate=useNavigate();//use for navigation from register to login
	
	
	
	const passwordVerificationInitialValues = useMemo(() => ({ 
    password: '',
    password_confirmation: '', 
  }), []);
	
	// validation rule for email and name
	
	const passwordSchema = useMemo(() => 
		Yup.object().shape({
			password: Yup.string()
				.required('Password is required')
				.min(8, 'Password must be at least 8 characters long')
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
					'Password must include uppercase, lowercase, number, and special character'
				),
				
			password_confirmation: Yup.string()
				.required('Please confirm your password')
				.oneOf([Yup.ref('password'), null], 'Passwords must match'),
		}),
	[]);

	
	const handleStoringUser  = useCallback(async ( values, { setSubmitting }) => {
	 
		try
		{
			setStoring(true);
			const data = {
				email:signUpData.email.trim(),
				name:signUpData.name.trim().replace(/<[^>]*>?/gm, ''),
				password:values.password.trim(),
				password_confirmation:values.password_confirmation.trim(),
			};
			const url=window.location.origin + '/store-user';
			const response = await axios.post(url, data);
			// console.log(response.data);
			if(response?.data?.status )
			{ 
				setSignUpData({
					email: '',
					name: '',
					password: '', 
				});
				setStored(true);
				setsubmitionMSG(response?.data?.message || 'Sign up has successfully completed. Now you can login.');
				
			}
			else
			{
				setStored(false);
				setsubmitionMSG(response?.data?.message || 'Failed to sign up. Please try again later..');
			}
		}
		catch(e)
		{
			//console.log(e);
			setStored(false);
			setsubmitionMSG('Oops! Something went wrong. Please try again later..');
		}
		finally{
			setStoring(false);
			setShowModel(true);
			setSubmitting(false);
		}
		 
  }, [signUpData ]);
	
	const handleModelClose  = useCallback((val) => {
		if(stored)
		{ 
			navigate('/login');
		}
		setShowModel(false);
	 }, [setStep, stored ]);
	 
	 
	 	//handle password hide and show
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(showPassword => !showPassword);
  }, []);
	
	
 return (
		<>
			<Formik validationSchema={passwordSchema} onSubmit={handleStoringUser} initialValues={passwordVerificationInitialValues}>
				{({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
				
					<Form noValidate onSubmit={handleSubmit}> 
							
							{/* Password field */}
							<Form.Group className="py-2" controlId="password">
								<Form.Label>Password</Form.Label>
								<InputGroup>
									<Form.Control 
									type={showPassword ? 'text' : 'password'} 
									className="rounded login_input"
									placeholder="Password"
									name="password" 
									value={values.password}
									onChange={handleChange} 
									isInvalid={touched.password && !!errors.password} 
									autoComplete={showPassword ? 'off' : 'password'} 
									 />
									
									{values.password !== '' && (
										<Button variant=" " className="py-0" style={{ position: 'absolute', right: '3px', top: '4px', height: '30px', zIndex: '6', background:'#fff'}} onClick={togglePasswordVisibility}>
											{showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
										</Button>
									)}
									<Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
								</InputGroup>
							</Form.Group>
							
							
							{/* Password field */}
							<Form.Group className="py-2" controlId="password_confirmation">
								<Form.Label>Confirm Password</Form.Label>
							 
									<Form.Control 
									type="text" 
									className="rounded login_input"
									placeholder="Re-enter password" 
									name="password_confirmation" 
									value={values.password_confirmation}
									onChange={handleChange}
									isInvalid={touched.password_confirmation && !!errors.password_confirmation}  
									autoComplete="off" 
									/>
									 
									<Form.Control.Feedback type="invalid">{errors.password_confirmation}</Form.Control.Feedback>
								 
							</Form.Group>
							
							<Button 
								type="submit"
								variant="dark" 
								id="submitBTN" 
								title="Submit for sign up"
								className="mt-3 w-100" 
								disabled={storing}
							>
								{
									storing ? 'Submitting' : 'Submit'
								}
								 
							</Button>
					
					</Form>
				
				)}
			</Formik>
			<MessageAlert setShowModel={handleModelClose} showModel={showModel} message={submitionMSG}/>
		</>
  );
};

export default  memo(SignUpPasswordVerification);
