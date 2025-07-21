// resources/js/components/CandidateRecruiterShared/Logout.jsx
  
import   {useEffect, useState}  from 'react';   
import {useDispatch, useSelector } from 'react-redux'; 
import { logout} from '../../StoreWrapper/Slice/AuthSlice'; 
import authUpdate from '../../StoreWrapper/UpdateStore/authUpdate';
import { setActiveLink } from '../../StoreWrapper/Slice/userNavBarSlice';
import Spinner from 'react-bootstrap/Spinner'
//import manageVisitedUrl from '../../CustomHook/manageVisitedUrl';
import PageSeo from '../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import {useNavigate } from 'react-router-dom'; 
import { Container, Card, Button  } from 'react-bootstrap';

const Logout = () => {
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {   
			dispatch(setActiveLink({activeLinkIndex:9}));
  }, [ ]);
	
	
	//function for handle logout
	const handleLogout = async() =>
	 {  
			
			
			try
			{		  
				setLoading(true);
				const headers = {
						'Authorization': `Bearer ${authToken}`
					}; 
				const url = window.location.origin + '/logout';
				const response = await axios.post(url,{},{headers});
				if(response.data.status === true)				
				{ 
					 dispatch(logout());
					 authUpdate(false, '', []); 
					 //call function to add current url into array of visited url
						//manageVisitedUrl('/', 'addNew');
					 navigate('/'); 
				}
				else
				{
					//console.log(response.data.message);
				}
				 
			}
			catch(error)
			{
					console.error('Error:', error);
			} 	 
			finally{
				setLoading(false);
			}
		
	 };
	 
	 //function for handle not logout
	const handleNotLogout = () =>
	{  
		//call function to pop the url from array of visited url
		//let url = manageVisitedUrl(null, 'popUrl');
		//alert(url);
		navigate(-1); 
	};
	  
	
	return (
	<>
		<PageSeo 
			title="Logging Out | SkillVilla"
			description="You are being securely logged out of your SkillVilla account."
			keywords="logout, SkillVilla, sign out, exit, account"
		/>

		<Container className="w-100 h-100 py-5 d-flex justify-content-center align-items-start"  fluid >
			<Card className="col-12 col-md-8 col-xl-5 shadow border-0">
				 <Card.Body> 
					<Card.Text>
						Are you sure you want to logout?
					</Card.Text>
					<div className=" d-flex flex-wrap gap-2 justify-content-end">
						 <Button variant="light" title="Cancel logout out" id="cancelLogoutBTN" onClick={handleNotLogout}  >Not</Button>
						
						<Button variant="dark" title="Lougout now" id="logoutbtn" onClick={handleLogout} disabled={loading}>
							{
								loading ?
								<Spinner size="sm"/>
								:
								'Yes'
							}
					 
						</Button>
					</div>
				</Card.Body>
			</Card>
		</Container>
	</>
	);
};

export default Logout;
