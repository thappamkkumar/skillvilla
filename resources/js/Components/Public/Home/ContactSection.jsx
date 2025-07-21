 
import   Row   from 'react-bootstrap/Row';
import   Col   from 'react-bootstrap/Col'; 
import ContactAddress from './ContactAddress';
import ContactMessage from './ContactMessage';
import SocialMediaLink from './SocialMediaLink';

const ContactSection = () => {
   
  return (
    <section id="contact" className=" py-5 px-2 px-md-3 px-lg-4 px-xl-5" >
       <h2 className="text-center fw-bold pb-4">Contact Us</h2>
        <Row className="g-4 w-100 m-0 ">
          {/* Contact Info */}
          <Col md={6}>
            <div className="sub_main_container rounded p-5 p-md-3 p-lg-3 p-xl-4 p-xxl-5  h-100">
							 <h4 className="fw-bold mb-3">Get in Touch</h4>
							  <ContactAddress /> 
								<div className=" mt-5">
									 <h6 className="fw-bold mb-3">Follow us</h6>
									<SocialMediaLink />
							</div>
            </div>
          </Col>

          {/* Contact Form */}
          <Col md={6}>
             <div className="sub_main_container rounded p-5 p-md-3 p-lg-3 p-xl-4 p-xxl-5 h-100">
							 <h4 className="fw-bold mb-3">Send a Message</h4>
							  <ContactMessage /> 
            </div>
          </Col>
        </Row>
      
    </section>
  );
};

export default ContactSection;
