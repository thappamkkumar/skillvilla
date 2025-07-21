import { memo, useState } from 'react';
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 
const UpdateCommunityDetailPage = ({ formData, setFormData, errors, setErrors, onSubmit, submitting,   }) => {
	 
	 const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }; 
	  
    return (
         <Form onSubmit={onSubmit} autoComplete="off">
            <Row className="w-100   m-0">
                <Col xs={12} md={12}>
                    <Form.Group className="mb-3" controlId="communityName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
														 placeholder="Enter community name"
                            className="formInput" 
                        />
                        {errors.name && <p className="text-danger">{errors.name}</p>}
                    </Form.Group>
                </Col>
								  
						    <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="communityPrivacy">
                        <Form.Label>Privacy</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="privacy" 
                            value={formData.privacy || "public"} 
                            onChange={handleInputChange} 
                            className="formInput" 
                        >
                            <option value="">Select Privacy</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </Form.Control>
                        {errors.privacy && <p className="text-danger">{errors.privacy}</p>}
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="communityContentShareAccess">
                        <Form.Label>Content Share Access</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="content_share_access" 
                            value={formData.content_share_access || "everyone"} 
                            onChange={handleInputChange} 
                            className="formInput" 
                        >
                            <option value="">Select Access</option>
                            <option value="everyone">Everyone</option>
                            <option value="selected">Selected Members Only</option>
                        </Form.Control>
                        {errors.content_share_access && <p className="text-danger">{errors.content_share_access}</p>}
                    </Form.Group>
                </Col>
								<Col xs={12} md={12}>
                    <Form.Group className="mb-3" controlId="communityDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            name="description" 
													 
                            value={formData.description} 
                            onChange={handleInputChange} 
                            className="formInput"
														placeholder="Enter community description"														
                        />
                        {errors.description && <p className="text-danger">{errors.description}</p>}
                    </Form.Group>
                </Col>
            
                
            </Row>
             
						
           <Row  className="w-100   m-0">
							<Col xs={12}>
										{/* Submit Button */}
									<Button type="submit" className="w-100 mt-3  " variant="dark" id="submitFormButton" disabled={submitting}>
										 Submit 
								</Button>
							</Col>
					</Row>
        </Form>
    );
};

export default memo(UpdateCommunityDetailPage);
