import { memo } from 'react';
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form';  
import Row from 'react-bootstrap/Row';  
import Col from 'react-bootstrap/Col';  
  
import TextEditor from '../../Common/TextEditor'; 

const AddProblemForm = ({ formData, setFormData, errors, onSubmit }) => {

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (files) {
            // Handle file input (attachment)
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0], // Single file for the attachment
            }));
        } else {
            // Handle regular input fields (text/textarea)
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
	
	
	// handle add description to form data
	const handleDescriptionChange = (val) => { 
        setFormData((prevData) => ({ ...prevData, description: val }));
    };
		
		
    return (
					<div>
            <Form noValidate onSubmit={onSubmit} autoComplete="off">
                <Row className="w-100   m-0">
                    <Col xs={12} md={12} className="mb-3">
                        <Form.Group controlId="problemTitle">
                            <Form.Label>Title <small className="text-danger">*</small></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                className="formInput"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
								</Row>
								<Row className="w-100   m-0">
                    <Col xs={12} md={12} className="mb-3">
                        <Form.Group controlId="problemDescription">
                            <Form.Label>Description <small className="text-danger">*</small></Form.Label>
                            <TextEditor
														value={formData.description}
														onChange={handleDescriptionChange}
														className={`custom-text-box ${errors.description && 'border-danger'}`}
														placeholder="Describe your problem.."
													/>
													 
													<small className="text-danger mt-1">{errors.description}</small>
                        </Form.Group>
                    </Col>
									</Row>
									<Row className="w-100   m-0">
                    <Col xs={12} md={6} className="mb-3">
                        <Form.Group controlId="problemAttachment">
                            <Form.Label>Provide Additional Materials [<small className="text-danger">optional</small>]</Form.Label>
                            <Form.Control
                                type="file"
                                className="formInput"
                                name="attachment" // Single file input for attachment
                                accept="image/jpg,image/jpeg, image/png, application/pdf, application/zip" // Adjust file types as needed
                                onChange={handleChange}
                                isInvalid={!!errors.attachment}
                            />
                            <Form.Control.Feedback type="invalid">{errors.attachment}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6} className="mb-3">
                        <Form.Group controlId="problemExternalURL">
                            <Form.Label>External URL [<small className="text-danger">optional</small>]</Form.Label>
                            <Form.Control
                                type="url"
                                className="formInput"
                                placeholder="Enter external url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                isInvalid={!!errors.url}
                            />
                            <Form.Control.Feedback type="invalid">{errors.url}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="w-100   m-0">
									<Col xs={12} md={12} className="mb-3">
										<Button variant="dark" type="submit" className="w-100 mt-3  " title="submit problem to get solutions" id="addProblemFormSubmitButton">
											Submit
										</Button>
								 </Col>
							 </Row>
            </Form>

            <div className="pt-5">
                <h4>Notes</h4>
                <ul>
                    <li><span className="text-danger">*</span> indicates important fields.</li>
                    <li>[<span className="text-danger">optional</span>] indicates optional fields.</li> 
                </ul>
            </div>
        </div>
    );
};

export default memo(AddProblemForm);
