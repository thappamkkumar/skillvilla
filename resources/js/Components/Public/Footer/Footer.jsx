import {   Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import SocialMediaLink from '../Home/SocialMediaLink';
const Footer = () => {
	 
	
  return (
    <footer className="  px-2 px-md-3 px-lg-4 px-xl-5 border border-top footerSection ">
       
        <Row className="py-5 w-100 m-0 ">
          <Col sm={12} md={6} className="  mb-5"> 
						<div className="mx-auto mx-md-0 text-center text-md-start " style={{maxWidth:'500px'}}>
							<h5 className="fw-bold">SkillVilla</h5>
							<p className="small">
								Discover your professional identity with SkillVilla — a modern platform for networking, collaboration, and opportunity.
							</p>
							<div className=" mt-2">
								<SocialMediaLink />
							</div>
            </div>
          </Col>

          <Col sm={6} md={3} className=" mb-3">
            <h6 className="fw-semibold mb-2 ">Pages</h6>
            <ul className="list-unstyled small">
              <li><Link to="/" className="footer-link d-inline-block mb-2 text-decoration-none">Home</Link></li>
               <li><HashLink smooth to="/#features" className="footer-link d-inline-block mb-2 text-decoration-none">Features</HashLink></li>
               <li><HashLink smooth to="/about" className="footer-link d-inline-block mb-2 text-decoration-none">About</HashLink></li>
              <li><HashLink smooth to="/#contact" className="footer-link d-inline-block mb-2 text-decoration-none">Contact</HashLink></li>
       
            </ul>
          </Col>

          <Col sm={6} md={3} className="  ">
            <h6 className="fw-semibold mb-2 ">Account</h6>
            <ul className="list-unstyled small">
              <li><Link to="/sign-up" className="footer-link d-inline-block mb-2 text-decoration-none">Sign Up</Link></li>
              <li><Link to="/login" className="footer-link d-inline-block mb-2 text-decoration-none">Login</Link></li>
            </ul>
          </Col>
				</Row>
				<Row className=" w-100 m-0 py-3 border-top   ">
          <Col xs={12} sm={12}   className="    text-center">
            <p className="small text-muted mb-0">
              &copy; {new Date().getFullYear()} SkillVilla. All rights reserved.
            </p>
          </Col>
        </Row>
       
    </footer>
  );
};

export default Footer;
