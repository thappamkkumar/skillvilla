 import  { useState, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import  Button from 'react-bootstrap/Button';
import * as Yup from 'yup';
import { Formik } from 'formik'; 
import { useDispatch } from 'react-redux'; 
  
import LoginForm from '../../Components/Public/LoginForm/LoginForm'; 
import MessageAlert from '../../Components/MessageAlert';
import PageSeo from '../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)
	
import authUpdate from '../../StoreWrapper/UpdateStore/authUpdate';
import {login, logout} from '../../StoreWrapper/Slice/AuthSlice';  

 
//import manageVisitedUrl from "../../CustomHook/manageVisitedUrl";

const LoginPage = () => {  
	
	const [showPassword, setShowPassword] = useState(false);//store password is hide or show
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [userData, setUserData] = useState(null); //state for store newly logged user data
	const [userToken, setUserToken] = useState(null); //state for store newly logged user token
	const [rememberMe, setRememberMe] = useState(null); //state for store remember me
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
	
		
 //initial value of form data
  const initialValues = useMemo(() => ({
    email: '',
    password: '',
    rememberMe: false,
  }), []);
	
//validation rules
  const schema = useMemo(()=>Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  }), []);
	
//handle form submition
  const handleSubmit =  useCallback(async (values, { setSubmitting }) => {
    try
		{
				let data = {
					email:values.email.trim(), 
					password:values.password.trim(),
					remember:values.rememberMe					
				}; 
			
			 
			const url = window.location.origin + '/login';
			const response = await axios.post(url, data);
			if(response?.data?.message)
			{
				setsubmitionMSG(response.data.message); 
			}
			else
			{
				setsubmitionMSG('Oops! Something went wrong. Please try again later.'); 
			}
			
			if(response?.data?.status)
			{
				setUserData(JSON.stringify(response.data.user));
				setUserToken(response.data.token);
				setRememberMe(data.remember);
			}
			  	 
			 
		}
		catch(error)
		{
			 // console.error('Error:', error);
			 setsubmitionMSG('Oops! Something went wrong. Please try again later.'); 
		}  
		finally
		{
			setShowModel(true);
			setSubmitting(false);
		}
  }, [dispatch]);
	
	
	
	
	//handle password hide and show 
	const togglePasswordVisibility = useCallback(() => {
			setShowPassword(showPassword => !showPassword);
		}, []);
		
		
	//handleforgot password
	const forgotPassword = useCallback(() => {
		 //manageVisitedUrl("/forgot-password", "append");
			navigate("/forgot-password");
		}, []);
		
		
	// function for handle register page open and login page close
	const handleSignUpPageNavigation = useCallback(() => {
	  //manageVisitedUrl("/sign-up", "append");
    navigate("/sign-up");
	}, []);
			
	
	const closeMessageBox = useCallback((val)=>{
		setShowModel(false);
		if(userData && userToken)
		{ 
			//manageVisitedUrl("/dashboard", "append");
			dispatch(login({token:userToken, user:userData}));
			
			authUpdate(true, userToken, userData, rememberMe);
			setUserData(null);
			//navigate('/home');
		}
	}, [userData, userToken, rememberMe]);
	
	  
	return ( 
		<>
			<PageSeo 
				title="Login | SkillVilla"
				description="Log in to your SkillVilla account to connect, share, and grow professionally."
				keywords="login, SkillVilla, sign in, user access"
			/>

			<section className=" px-2 pt-3 pb-5   login-main-container   "  > 
				<MessageAlert setShowModel={closeMessageBox} showModel={showModel} message={submitionMSG}/>
					
					<div className="p-3  p-md-3 p-lg-4 p-xl-5    mx-auto  rounded-5 sub_main_container login_container"  >
						 
						<h2 className="text-center   fw-bold ">Login</h2>
						
						<Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={initialValues}>
							{({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
								<LoginForm
									handleSubmit={handleSubmit}
									handleChange={handleChange}
									values={values}
									touched={touched}
									errors={errors}
									isSubmitting={isSubmitting}
									showPassword={showPassword}
									togglePasswordVisibility={togglePasswordVisibility}
									forgotPassword={forgotPassword}
								/>
							)}
						</Formik>
						<div className="pt-5  d-flex align-items-center justify-content-center">
							<span>
								Don't have an account?
								</span>
								<Button   variant="link" className=" p-1  "   id="registerPageNavigateBtn" title="Register Now" onClick={handleSignUpPageNavigation} >Sign up</Button>
							 
							
						</div>
					</div> 
				 
			</section>
		</>
	);
};

export default LoginPage;
