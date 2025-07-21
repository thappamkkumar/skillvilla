// PageNotFound.jsx
 
import {useCallback} from 'react'; 
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BsExclamationCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
 import { useSelector	 } from 'react-redux'; 
//import manageVisitedUrl from '../../CustomHook/manageVisitedUrl'; 
import PageSeo from '../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)



const PageNotFound = () => {
	  const is_login = useSelector((state) => state.auth.is_login); // Check login status
 
	const navigate=useNavigate();//use for navigation from register to login
	const handleBack = useCallback(() => {
		let url = '/';
		if(is_login)
		{
			navigate(-1); 
		}     
		else
		{
			navigate('/');
		}	
		 

		}, []);
		
  return (
		<>
			<PageSeo 
				title="Page Not Found | SkillVilla"
				description="The page you're looking for doesn’t exist. Try going back or visit the home page."
				keywords="404, page not found, SkillVilla, broken link"
			/>

			<Container className="page-not-found"   fluid>
				 <Row className="justify-content-center">
						<Col md={8} className="text-center">
							<BsExclamationCircle className="not-found-icon" />
							<h1 className="not-found-heading">Oops! Page Not Found</h1>
							<p className="not-found-text">
								The page you're looking for might have been removed or doesn't exist.
							</p>
							 
								<Button  variant="dark" className="  fw-bold shadow-lg mx-1  " id="wrongPagebtn" title= "Go to back"  onClick={handleBack}>Go to back </Button>
							
						</Col>
					</Row>
			</Container >
		</>
  );
};

export default PageNotFound;
