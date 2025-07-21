 

import { useNavigate } from 'react-router-dom';  
import Button from 'react-bootstrap/Button'; 

const CTASection = () => {
	
	const navigate = useNavigate(); //geting reference of useNavigate into navigate


  const handleClick = () => {
     navigate("/sign-up");
  };

  return (
    <section className="py-5 px-2 px-md-3 px-lg-4 px-xl-5  d-flex flex-column align-items-center justify-content-center ctaSection">
      
      <h4><strong>Ready to join the future of professional networking?</strong></h4>
			<p>Create your profile today and unlock new possibilities.</p>
			
			<Button size="lg"  className="btn btn-light   fw-bold px-4 py-2" 
			title="Get Started" 
			id="getStartNowBTN" 
			onClick={handleClick}>
				Get Started
			</Button>
             
    </section>
  );
};

export default CTASection;
