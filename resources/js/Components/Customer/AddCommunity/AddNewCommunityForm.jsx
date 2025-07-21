import {memo} from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

import TextEditor from '../../Common/TextEditor';

const AddNewCommunityForm = ({ formData, setFormData, errors, onSubmit, submitting }) => {
    
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value
        }));
    };
		
		// handle add description to form data
		const handleDescriptionChange = (val) => { 
        setFormData((prevData) => ({ ...prevData, description: val }));
    };
		
		
    return (
        <Form onSubmit={onSubmit} autoComplete="off">
            <Row className="w-100   m-0">
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="communityName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
														 placeholder="Enter community name"
                            className="formInput" 
														isInvalid={!!errors.name}
                        />
                        {errors.name && <p className="text-danger">{errors.name}</p>}
                    </Form.Group>
                </Col>
								 <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="communityImage"> 
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control 
                            type="file" 
                            name="image" 
                            onChange={handleInputChange} 
                            className="formInput" 
														isInvalid={!!errors.image}
                        />
                        {errors.image && <p className="text-danger">{errors.image}</p>}
                    </Form.Group>
                </Col>
						    <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="communityPrivacy">
                        <Form.Label>Privacy</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="privacy" 
                            value={formData.privacy} 
                            onChange={handleInputChange} 
                            className="formInput"
														isInvalid={!!errors.privacy}
														
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
                            value={formData.content_share_access} 
                            onChange={handleInputChange} 
                            className="formInput" 
														isInvalid={!!errors.content_share_access}
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
                        <TextEditor
												value={formData.description}
												onChange={handleDescriptionChange}
												className={`custom-text-box ${errors.description && 'border-danger'}`}
												placeholder="Write your community description..."
											/>
											 
											<small className="text-danger mt-1">{errors.description}</small>
                    </Form.Group>
                </Col>
            
                
            </Row>
             
						
           <Row  className="w-100   m-0">
							<Col xs={12}>
										{/* Submit Button */}
									<Button type="submit" variant="dark" title="Submit" className="w-100 mt-3    "   id="submitFormButton" disabled={submitting}>
										 Submit 
								</Button>
							</Col>
					</Row>
        </Form>
    );
};

export default memo(AddNewCommunityForm);
