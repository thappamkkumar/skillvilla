 
import {useState, useMemo, useCallback , memo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import  Button from 'react-bootstrap/Button';  
import * as Yup from 'yup';
import { Formik } from 'formik'; 
 
import ForgotPasswordEmailVerification from '../../Components/Public/ForgotPassword/ForgotPasswordEmailVerification';
import SignUpOTPVerification from '../../Components/Public/SignUpForm/SignUpOTPVerification';
import ForgotNewPasswordVerification from '../../Components/Public/ForgotPassword/ForgotNewPasswordVerification';
import MessageAlert from '../../Components/MessageAlert';
//import VerifyEmail from '../../Components/Public/SignUpForm/VerifyEmail';    
import PageSeo from '../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

const ForgotPasswordPage = ( ) => {
	
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const [step, setStep]=useState(1);
	const [forgotPasswordData, setForgotPasswordData]=useState({ 
    email: '', 
  });
	 
   

	  
	
	// function for handle login page navigation
	const handleLoginPageNavigation = useCallback(() => {
		//let url = manageVisitedUrl(null, "popUrl");
    navigate("/login");
	}, []);
	

  return (
		<>
			<PageSeo 
				title="Reset Password | SkillVilla"
				description="Recover your SkillVilla account by resetting your password."
				keywords="reset password, forgot password, SkillVilla, account recovery"
			/>

			<section className="px-2 pt-3 pb-5    login-main-container  "  > 
				 
				<div className="p-3  p-md-3 p-lg-4 p-xl-5    mx-auto  rounded-5 sub_main_container login_container"  >
					<h2 className="text-center fw-bold  ">Forgot Password</h2>
					
					{
						step == 1 && <ForgotPasswordEmailVerification setStep={setStep}  setForgotPasswordData = {setForgotPasswordData} />
					}
					{
						step == 2 && <SignUpOTPVerification signUpData={forgotPasswordData} setStep={setStep}  />
					}
					{
						step == 3 && <ForgotNewPasswordVerification forgotPasswordData={forgotPasswordData}  setForgotPasswordData = {setForgotPasswordData} setStep={setStep} />
					}
					
				</div>
			</section>
		</>
  );
};

export default ForgotPasswordPage;
