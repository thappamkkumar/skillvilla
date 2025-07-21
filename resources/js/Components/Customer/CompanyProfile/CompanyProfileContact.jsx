 
import   {memo } from 'react';  
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';

const CompanyProfileContact = ({ address, email, phone, website }) =>
{
	 
	 
	return(
	
		<div className="w-100 h-auto  ">
			<h4 >Contact Information</h4>
			
			<p>
				<FaMapMarkerAlt className="me-2 text-secondary" />
					<strong>Address:</strong> {address}
			</p>
			 
			<p>
					<FaEnvelope className="me-2 text-secondary" />
					<strong>Email:</strong>{' '}
					<a href={`mailto:${email}`} className="text-decoration-none">
						{email}
					</a>
			</p>
			
			<p>
					<FaPhone className="me-2 text-secondary" />
					<strong>Phone:</strong>{' '}
					<a href={`tel:${phone}`} className="text-decoration-none">
						{phone}
					</a>
			</p>
			
			<p>
				<FaGlobe className="me-2 text-secondary" />
					<strong>Website:</strong>{' '}
					<a href={website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
						{website}
					</a>
			</p>
			
		 
			
			
		</div>
		
		 
	);
};

export default memo(CompanyProfileContact);