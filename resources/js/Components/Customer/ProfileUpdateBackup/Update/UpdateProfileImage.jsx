 
import {memo} from 'react';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import handleImageError from '../../../../CustomHook/handleImageError';
const UpdateProfileImage = ({handleImageUpdate, image}) => { 
	
	

	return ( 
		<div className="w-100 h-auto  profileHeaderContainer">  
			<Row className="px-2 px-lg-4 py-4 m-0 align-items-center ProfileHeader  "> 
				<Col xs={12} sm={12} md={4} className="p-0 m-0">
					<Image src={`/profile_image/${(image == '' || image == null )?'profile_icon.png' : image}`} className="profile_image  d-block mx-auto mx-md-0  "  onError={(event)=>{ handleImageError(event, '/profile_image/profile_icon.png')} } alt="profile image "  roundedCircle thumbnail />
				</Col> 
				
				<Col  xs={12} sm={12} md={8} className="p-0 m-0 py-3 px-md-4 px-xl-0  ">
				 <Form.Group controlId="formFile" className="   text-white">
					<h2 className="pb-2">Update Profile Image</h2>
					<Form.Label>Select Image</Form.Label>
					<Form.Control type="file"  className="login_input" onChange={handleImageUpdate}  accept=".jpg, .jpeg, .png"  />
				</Form.Group>
				</Col> 
				
			</Row>
		</div>
	);
	
};

export default memo(UpdateProfileImage);
