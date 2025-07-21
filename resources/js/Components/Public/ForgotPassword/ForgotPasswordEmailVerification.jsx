import {memo, useState, useMemo, useCallback}from 'react';
import { Form, Button  } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';

import MessageAlert from '../../MessageAlert';
 

const ForgotPasswordEmailVerification = ({ setStep, setForgotPasswordData   }) => {
 const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [verifyingEmail, setVerifyingEmail] = useState(false);
	const [otpSend, setOtpSend] = useState(false);

	const emailVerificationInitialValues = useMemo(() => ({ 
    email: '',
  }), []);
	
	// validation rule for email and name
		const emailNameSchema = useMemo(() => Yup.object().shape({
			email: Yup.string()
				.email('Invalid email address')
				.required('Email is required'),
			 
		}), []);

	
	const handleEmailVerification  = useCallback(async ( values, { setSubmitting }) => {
	 
		try
		{
			setVerifyingEmail(true);
			const data = {
				email : values.email,
			}
			const url=window.location.origin + '/forgot-password-send-otp';
			const response = await axios.post(url, data);
			//console.log(response.data);
			if(response?.data?.status )
			{ 
				setForgotPasswordData({
					email: values.email,  
				});
				setOtpSend(true);
				setsubmitionMSG(response?.data?.message || 'Email has verified successfully and otp has send on email.');
				
			}
			else
			{
				setOtpSend(false);
				setsubmitionMSG(response?.data?.message || 'Failed to verify email and send otp. Please try again later..');
			}
		}
		catch(e)
		{
			//console.log(e);
			setOtpSend(false);
			setsubmitionMSG('Oops! Something went wrong. Please try again later..');
		}
		finally{
			setVerifyingEmail(false);
			setShowModel(true);
			setSubmitting(false);
		}
		 
  }, [ ]);
	
	const handleModelClose  = useCallback((val) => {
		if(otpSend)
		{
			
			setStep(pre=> pre+1);
		}
		setShowModel(false);
	 }, [setStep, otpSend ]);
	 
 return (
		<>
			<Formik validationSchema={emailNameSchema} onSubmit={handleEmailVerification} initialValues={emailVerificationInitialValues}>
				{({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
				
					<Form noValidate onSubmit={handleSubmit}> 
							
							 
							
							<Form.Group className="py-2" controlId="email">
								<Form.Label>Email</Form.Label>
								<Form.Control
								type="email" 
								className="login_input"
								placeholder="Enter email" 
								name="email"
								value={values.email}
								onChange={handleChange}  
								isInvalid={touched.email && !!errors.email}
								readOnly = {verifyingEmail}
								autoComplete="off" /> 
								<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>  
							</Form.Group>
							
							<Button 
								type="submit"
								variant="dark" 
								id="verifyEmailBTN" 
								title="Verify email"
								className="mt-3 w-100" 
								disabled={verifyingEmail}
							>
								{
									verifyingEmail ? 'Verifying...' : 'Verify'
								}
								 
							</Button>
					
					</Form>
				
				)}
			</Formik>
			<MessageAlert setShowModel={handleModelClose} showModel={showModel} message={submitionMSG}/>
		</>
  );
};

export default  memo(ForgotPasswordEmailVerification);
