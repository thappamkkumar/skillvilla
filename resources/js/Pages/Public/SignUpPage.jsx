 
import {useState,  useCallback , memo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import  Button from 'react-bootstrap/Button';  
import * as Yup from 'yup';
import { Formik } from 'formik'; 
 
import SignUpEmailVerification from '../../Components/Public/SignUpForm/SignUpEmailVerification';
import SignUpOTPVerification from '../../Components/Public/SignUpForm/SignUpOTPVerification';
import SignUpPasswordVerification from '../../Components/Public/SignUpForm/SignUpPasswordVerification';
import MessageAlert from '../../Components/MessageAlert';
//import VerifyEmail from '../../Components/Public/SignUpForm/VerifyEmail';    
import PageSeo from '../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

//import manageVisitedUrl from "../../CustomHook/manageVisitedUrl";

const SignUpPage = ( ) => {
	
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const [step, setStep]=useState(1);
	const [signUpData, setSignUpData]=useState({ 
    email: '',
    name: '',
    password: '', 
  });
	 
   

	  
	
	// function for handle login page navigation
	const handleLoginPageNavigation = useCallback(() => {
		//manageVisitedUrl("/login", "append");
    navigate("/login");
	}, []);
				

  return (
		<>
			<PageSeo 
				title="Sign Up | SkillVilla"
				description="Join SkillVilla to showcase your work, find opportunities, and connect with professionals."
				keywords="sign up, create account, SkillVilla, register"
			/>

			<section className="px-2 pt-3 pb-5    login-main-container  "  > 
				 
				<div className="p-3  p-md-3 p-lg-4 p-xl-5    mx-auto  rounded-5 sub_main_container login_container"  >
					<h2 className="text-center fw-bold  ">Sign Up</h2>
					
					{
						step == 1 && <SignUpEmailVerification setStep={setStep}  setSignUpData = {setSignUpData} />
					}
					{
						step == 2 && <SignUpOTPVerification signUpData={signUpData} setStep={setStep}  />
					}
					{
						step == 3 && <SignUpPasswordVerification signUpData={signUpData}  setSignUpData = {setSignUpData} setStep={setStep} />
					}
					 
						<div className="pt-5  d-flex align-items-center justify-content-center">
							<span>
								If already have an account?
								</span>
								<Button   variant="link" className=" p-1  "   id="loginPageNavigateBtn" title="Login Now" onClick={handleLoginPageNavigation} >Login</Button>
							 
							
						</div>
				</div>
			</section>
		</>
  );
};

export default SignUpPage;
