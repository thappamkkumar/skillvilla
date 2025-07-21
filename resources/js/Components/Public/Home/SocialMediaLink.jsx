 
 import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp} from 'react-icons/fa';

const SocialMediaLink = () => {
	
	 
  return (
    <div className="d-flex gap-3 justify-content-center justify-content-md-start">
      <a href="https://facebook.com" target="_blank" rel="noreferrer" 
				className="btn rounded-circle fs-5 social-btn facebook  "
			>
				<FaFacebookF />
			</a>
			<a href="https://twitter.com" target="_blank" rel="noreferrer" 
				className="btn rounded-circle fs-5 social-btn twitter"
			>
				<FaTwitter />
			</a>
			<a href="https://instagram.com" target="_blank" rel="noreferrer" 
				className="btn rounded-circle fs-5 social-btn instagram"
			>
				<FaInstagram />
			</a>
			<a href="https://wa.me/6005819576" target="_blank" rel="noreferrer" 
				className="btn rounded-circle fs-5 social-btn whatsapp"
			>
				<FaWhatsapp />
			</a>
             
    </div>
  );
};

export default SocialMediaLink;
