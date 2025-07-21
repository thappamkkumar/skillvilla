   
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactAddress = () => {
   
  return (
				<>
							<div className="mb-4">
								<a
									href="https://maps.app.goo.gl/Qanr4RMfhrTLrU4x8"
									target="_blank"
									rel="noopener noreferrer"
									className="text-decoration-none footer-link"
								>
									<span className="p-2 rounded-2 me-2 contact-address-icon">
										<FaMapMarkerAlt />
									</span>
									Kathua, Jammu And Kashmir, India
								</a>
							</div>
 
							<div className="mb-4">
								<a href="tel:+15551234567" className="text-decoration-none footer-link">
									<span className="p-2 rounded-2 me-2 contact-address-icon">
										<FaPhone />
									</span>
									+916005819576
								</a>
							</div>

							<div className="mb-4">
								<a href="mailto:contact@skillvilla.com" className="text-decoration-none footer-link">
									<span className="p-2 rounded-2 me-2 contact-address-icon">
										<FaEnvelope />
									</span>
									contact@skillvilla.com
								</a>
							</div>
 
							 
				</>
  );
};

export default ContactAddress;
