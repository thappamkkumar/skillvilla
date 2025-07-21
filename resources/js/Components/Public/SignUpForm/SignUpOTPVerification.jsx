import {memo, useState, useEffect, useMemo, useCallback}from 'react';
import { Form, Button  } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';

import MessageAlert from '../../MessageAlert';
 

const SignUpOTPVerification = ({ setStep, signUpData     }) => {
 const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [verifyingOTP, setVerifyingOTP] = useState(false);
	const [otpVerified, setOtpVerified] = useState(false); 
	const [otpResending, setOTPResending] = useState(false);
	const [timer, setTimer] = useState(300); // start with 2 mins or 0
	 
	const otpVerificationInitialValues = useMemo(() => ({ 
    otp: '', 
  }), []);
	
	
	
	// validation rule for otp
		const otpSchema = useMemo(() => Yup.object().shape({
			otp: Yup.string().required('OTP is required'),
		}), []);


	//handle timer for otp verification and re send otp
	useEffect(() => {
		let interval = null;
		if (timer > 0) {
			interval = setInterval(() => {
				setTimer(prev => prev - 1);
			}, 1000);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [timer]);


	//function for verify otp
	const handleOTPVerification  = useCallback(async ( values, { setSubmitting }) => {
	  const otpValue = values.otp?.trim();

    // ? Check OTP format before API call
    if (!/^\d{6}$/.test(otpValue)) {
        setOtpVerified(false);
        setsubmitionMSG('Please enter a valid 6-digit OTP.');
        setShowModel(true);
        setSubmitting(false);
        return;
    }
		try
		{
			setVerifyingOTP(true);
			const data = {
				email : signUpData.email,
				otp :otpValue,
			}
			const url=window.location.origin + '/verifying-otp';
			const response = await axios.post(url, data);
			//console.log(response.data);
			if(response?.data?.status )
			{ 
				 
				setOtpVerified(true);
				setsubmitionMSG(response?.data?.message || 'OTP verified successfully.');
				
			}
			else
			{
				setOtpVerified(false);
				setsubmitionMSG(response?.data?.message || 'Failed to verify otp. Please try again later..');
			}
		}
		catch(e)
		{
			// console.log(e);
			setOtpVerified(false);
			setsubmitionMSG('Oops! Something went wrong. Please try again later..');
		}
		finally{
			setVerifyingOTP(false);
			setShowModel(true);
			setSubmitting(false);
		}
		 
  }, [ signUpData]);
	
	
	//function for re send otp
	const reSendOTP = useCallback(async()=>{
		try
		{
			setOTPResending(true);
			const data = {
				email : signUpData.email,
			}
			const url=window.location.origin + '/email-verfication-send-otp';
			const response = await axios.post(url, data);
			//console.log(response.data);
			if(response?.data?.status )
			{ 
				setTimer(300);
				setsubmitionMSG(response?.data?.message || 'Email has verified successfully and otp has send on email.');
				
			}
			else
			{
				 
				setsubmitionMSG(response?.data?.message || 'Failed to verify email and send otp. Please try again later..');
			}
		}
		catch(e)
		{
			//console.log(e); 
			setsubmitionMSG('Oops! Something went wrong. Please try again later..');
		}
		finally{
			setOTPResending(false); 
		}
		 
		
	}, [signUpData]);
	
	
	const handleModelClose  = useCallback((val) => {
		if(otpVerified)
		{ 
			setStep(pre=> pre+1);
		}
		 
		setShowModel(false);
	 }, [setStep, otpVerified ]);
	 
 return (
		<>
			<Formik validationSchema={otpSchema} onSubmit={handleOTPVerification} initialValues={otpVerificationInitialValues}>
				{({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
				
					<Form noValidate onSubmit={handleSubmit}> 
							
						<Form.Group className="py-2" controlId="otp">
							<Form.Label>OTP</Form.Label>
							
							<Form.Control 
							type="text" 
							className="login_input"
							placeholder="Enter otp"
							name="otp"
							value={values.otp} 
							onChange={handleChange}
							isInvalid={touched.otp && !!errors.otp}
							autoComplete="off" />
							
							<Form.Control.Feedback type="invalid">{errors.otp}</Form.Control.Feedback>
							
							
						</Form.Group>
							 
						{timer > 0 && (
							<p className="text-muted text-end">
								You can resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
							</p>
						)}

						{
							timer == 0
							?
								<Button  
									variant="dark" 
									id="otpResend" 
									title="Re-send otp"
									className="mt-3 w-100" 
									onClick={reSendOTP}
									disabled={otpResending}
								>
									{
										otpResending ? 'Sending' : 'Re-Send OTP'
									}
									 
								</Button>
							:
							<Button 
								type="submit"
								variant="dark" 
								id="verifyOTPBTN" 
								title="Verify otp"
								className="mt-3 w-100" 
								disabled={verifyingOTP}
							>
								{
									verifyingOTP ? 'Verifying' : 'Verify'
								}
								 
							</Button>
						}
							
							
					
					</Form>
				
				)}
			</Formik>
			<MessageAlert setShowModel={handleModelClose} showModel={showModel} message={submitionMSG}/>
		</>
  );
};

export default  memo(SignUpOTPVerification);
