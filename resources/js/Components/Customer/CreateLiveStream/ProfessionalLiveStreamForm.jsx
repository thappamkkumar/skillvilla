import { memo, useCallback} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import TextEditor from '../../Common/TextEditor';

const ProfessionalLiveStreamForm = ({
	formData, 
	setFormData, 
	errors, 
	goLive,  
	submitting,  
	categories,  
}) => {

    const handleChange = useCallback((e)=>{
			const { name, value } = e.target;
			setFormData((prevData) => ({ 
			...prevData,
			[name]: name === "category_id" ? Number(value) : value,
			}));
		}, []);
		
		// handle add description to form data
		const handleDescriptionChange = (val) => { 
        setFormData((prevData) => ({ ...prevData, description: val }));
    };
		
    return (
        <div className="py-4">
            <Form noValidate onSubmit={goLive}  autoComplete="off">
              <Row className="w-100   m-0">
								{/* Title Input */}
								<Col xs={12} md={6}  >
								
									<Form.Group className="mb-3" controlId="LiveTitle">
											<Form.Label>  Title </Form.Label>
											<Form.Control
													type="text"
													className="formInput"
													placeholder="eg. 'Engaging Live Q&A on Web Development' "
													name="title"
													value={formData.title}
													onChange={handleChange}
													isInvalid={!!errors.title}
											/>
											<Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
									</Form.Group>
										
								</Col>  
								
								
								{/* Category Input */}
								<Col xs={12} md={6}>
										<Form.Group className="mb-3"   controlId="Categories">
											<Form.Label>Categories</Form.Label>
											<Form.Control
												as="select"
												name="category_id"
												className={`formInput text  ${!formData.category_id && 'text-muted'}`}
												value={formData.category_id || ''}
												onChange={handleChange}
												isInvalid={!!errors.category_id}
											>
												<option value=""   className="bg-body-tertiary">Select Categories</option>
												 {categories.map((cat) => (
														<option 
														key={cat.id} 
														value={cat.id} 
														>
															{cat.name}
														</option>
													))}
											</Form.Control>
											<Form.Control.Feedback type="invalid">
												{errors.category_id}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								
								
								
								{/* Description Input */}
								<Col xs={12}>
									<Form.Group className="mb-3" controlId="jobDescription">
											<Form.Label>Description</Form.Label>
										 
											<TextEditor
												value={formData.description}
												onChange={handleDescriptionChange}
												className={`custom-text-box ${errors.description && 'border-danger'}`}
												placeholder="Share details about the topic, structure, and what viewers will gain from your live session."
											/>
											
											<small className="text-danger mt-1">{errors.description}</small>
									</Form.Group>
								</Col>
									

								<Col xs={12}>									
									<Button 
										variant="dark" 
										type="submit"								
										title="Submit Professional Live Stream." 
										id="addStoriesFormSubmitButton"
										className="w-100 mt-3  " 
										 
										disabled={submitting}
									>
										{
											submitting ? 'Uploading...' : 'Upload'
											
										}  
									</Button>
								</Col>
							</Row>  
								 
                
								 
                 

                
            </Form>

            

        </div>
    );
};

export default memo(ProfessionalLiveStreamForm);
