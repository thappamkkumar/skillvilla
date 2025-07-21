// src/routes/PublicRoutes.js
import  {useState, useEffect, Suspense  } from 'react';   
import {    Routes, Route, useNavigate, useLocation  } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux'; 
import {login, logout} from '../StoreWrapper/Slice/AuthSlice';  
import authUpdate from '../StoreWrapper/UpdateStore/authUpdate'; 



//components  
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes'; 
import Loading from '../Components/Loading'; 
 
import PublicLayoutPage from '../Layout/PublicLayoutPage';
import HomePage from '../Pages/Public/HomePage' ;
import LoginPage from '../Pages/Public/LoginPage' ;
import SignUpPage from '../Pages/Public/SignUpPage' ;
import ForgotPasswordPage from '../Pages/Public/ForgotPasswordPage' ;
import AboutPage from '../Pages/Public/AboutPage' ; 
import PageNotFound from '../Pages/Public/PageNotFound';
import AdminLoginPage from '../Pages/Admin/LoginPage/AdminLoginPage';
	 
  
//hookes or function
import manageVisitedUrl from '../CustomHook/manageVisitedUrl';
import serverConnection from '../CustomHook/serverConnection'; 


//CSS
import '../../css/main.css';
import '../../css/home.css';
import '../../css/navigation.css';
import '../../css/PageNotFound.css';
import '../../css/color.css';
import '../../css/post.css';
import '../../css/header.css'; 
import '../../css/login.css'; 
import '../../css/profile.css'; 
import '../../css/chat.css'; 
import '../../css/workfolio.css'; 
import '../../css/stories.css'; 
import '../../css/job.css'; 
import '../../css/explore.css'; 
import '../../css/userCard.css'; 
import '../../css/community.css'; 
import '../../css/share.css'; 
import '../../css/stepper.css'; 

const AppRoutes = () => {
	const is_login = useSelector((state) => state.auth.is_login);//get login info 
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const currentLocation = useLocation(); //geting reference of useNavigate into navigate
	const [loading, setLoading] = useState(false);
	 
	
	//Function for refresh login if session or local storage has data else navigate to login page
	const checkLogin = async() =>
	{
		 
		
		
			const is_login_session = JSON.parse(sessionStorage.getItem('is_login') || 'false');
			const storedToken = localStorage.getItem('token');
			const storedUser = localStorage.getItem('user');
			const rememberMe = JSON.parse(localStorage.getItem('rememberMe') || 'false');
			 
			 
			   
			 
			//it work when login has true in session
			if(is_login_session && storedToken && storedUser)
			{
				// console.log('already logged');
				dispatch(login({token:storedToken, user:storedUser}));
				return;
			}
			 
			if(!storedToken || !rememberMe ) 
			{
				
				// console.log('token null or not remember'); 
				 
				 
				const { pathname } = currentLocation; 
				const publicPath =   
				[
						"/admin/login",
						"/#contact",
						"/#features",
						"/about",
						"/login",
						"/forgot-password",
						"/sign-up",
				];
				const url = publicPath.includes(pathname) ? pathname : '/'; 
				navigate(url);
				return;
			}
			
			try
			{
				 
				setLoading(true); 
				
				const path='/check-user';  
				const response =  await serverConnection(path, {remember: rememberMe || false }, storedToken);
				 // console.log(response);
			 
				if(response && response.user)				
				{ 
					const refreshToken = response.newToken ? response.newToken : storedToken;
					const userDataValues = JSON.stringify(response.user);
					
						
				 //console.log('refresh or check user and token');
				 
				 
					dispatch(login({token:refreshToken, user:userDataValues}));
					authUpdate(true,refreshToken, userDataValues, rememberMe);
					//console.log(currentLocation);
					 //console.log(response.user.user_role);
					
					const { pathname } = currentLocation;
					const role = response.user.user_role;

					const url = pathname === '/'
						? role === 'Customer'
							? '/home'
							: role === 'Admin'
								? '/admin/dashboard'
								: pathname
						: pathname;

					navigate(url);

				}
				else
				{  
					
				 //console.log('token expired');
					dispatch(logout());
					authUpdate(false, '', []); 
					navigate('/');
				}
			}
			catch(e)
			{
				 console.error(e);
				dispatch(logout());
				authUpdate(false, '', []);
				navigate('/');
			}
			finally
			{
				setLoading(false);
			}
				
				
			 
		
	}
	
	
	 
	useEffect(() => { 
		  
			checkLogin();    
		  
  }, [ ]);
	

	
	 
	
	
	
	if(loading)
	{
		return (<Loading />);
	}
	
    return (
        
								 
					<Suspense fallback={<Loading />}>	
					
						<Routes>
							
							{/* Public Route */}
							<Route element={<PublicLayoutPage />}>
								<Route  path="/" element={<HomePage />} />
								<Route  path="/login" element={<LoginPage />} />								
								<Route  path="/sign-up" element={<SignUpPage />} />								
								<Route  path="/forgot-password" element={<ForgotPasswordPage />} /> 
								<Route  path="/about" element={<AboutPage />} />  
								<Route path="/admin/login" element={<AdminLoginPage />} />
							</Route>
							 
							{/* customer Route start */} 
							<Route path="/*" element={<CustomerRoutes />} />
								 
							{/* admin Route start */} 
							<Route path="/admin/*" element={<AdminRoutes />} />
							
								 
						 
							
							
							
							
						</Routes>

					</Suspense>			
								 
						 
			
    );
};

export default AppRoutes;
