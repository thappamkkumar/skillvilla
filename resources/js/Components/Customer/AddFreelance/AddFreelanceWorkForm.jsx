import { memo, useState } from 'react';
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BsX   } from 'react-icons/bs'; 
 
import TextEditor from '../../Common/TextEditor';

const AddFreelanceWorkForm = ({ formData, setFormData, errors, setErrors, onSubmit, submitting, update=false }) => {
	 // State for the new skill input field
    const [newSkill, setNewSkill] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
				setFormData((prevData) => ({ ...prevData, [name]: value }));
         
    };


		 // Handle adding a skill to the skills array in formData
    const handleAddSkill = () => {
        const trimmedSkill = newSkill.trim(); // Trim the input value
        if (trimmedSkill && !formData.skill_required.includes(trimmedSkill)) {
            setFormData((prevData) => ({
                ...prevData,
                skill_required: [...prevData.skill_required, trimmedSkill], // Add skill to the array
            }));
            setNewSkill(''); // Clear the input field after adding the skill
        }
    };


   // Handle removing a skill from the skills array in formData using its index
    const handleRemoveSkill = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            skill_required: prevData.skill_required.filter((_, i) => i !== index), // Remove skill by index
        }));
    };

		// handle add description to form data
		const handleDescriptionChange = (val) => { 
        setFormData((prevData) => ({ ...prevData, description: val }));
    };

    return (
         
            <Form noValidate onSubmit={onSubmit} autoComplete="off">
                <Row className="w-100   m-0">
                    {/* Title Input */}
                    <Col xs={12} md={6}  >
                        <Form.Group className="mb-3" controlId="jobTitle">
                            <Form.Label>  Title </Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., Design a website, Develop a mobile app."
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
									<Col xs={12} md={6}>
										<Form.Group className="mb-3"   controlId="experienceLevel">
											<Form.Label>Experience Level</Form.Label>
											<Form.Control
												as="select"
												name="experience_level"
												className="formInput"
												value={formData.experience_level || ''}
												onChange={handleChange}
												isInvalid={!!errors.experience_level}
											>
												<option value="">Select Experience Level</option>
												<option value="beginner">Beginner</option>
												<option value="intermediate">Intermediate</option>
												<option value="expert">Expert</option>
											</Form.Control>
											<Form.Control.Feedback type="invalid">
												{errors.experience_level}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
															
                </Row>

                <Row  className="w-100   m-0">
                    {/* Description Input */}
                    <Col xs={12}>
                        <Form.Group className="mb-3" controlId="jobDescription">
                            <Form.Label>Description</Form.Label>
                           
														<TextEditor
															value={formData.description}
															onChange={handleDescriptionChange}
															className={`custom-text-box ${errors.description && 'border-danger'}`}
															placeholder="Describe your requirements and responsibilties.."
														/>
														
                            <small className="text-danger mt-1">{errors.description}</small>
                        </Form.Group>
                    </Col>
                </Row>

                <Row  className="w-100   m-0">
									 {/* Skills Required Input */}
                    <Col xs={12} md={12}>
										 <Form.Label htmlFor="skillRequired">Skills Required</Form.Label>
										 
										 {formData.skill_required.length > 0 && (
                                <div className="d-flex flex-wrap pb-2 tech_skill_container" >
                                    {formData.skill_required.map((skill, index) => (
                                        <span key={index} className="border border-0 mx-1 my-1 p-1 px-2 rounded tech_skill">
                                            <span className="pe-3">{skill}</span>
                                            <Button
                                                variant="danger"
                                                title={`remove skill ${index}`}
                                                id={`removeSkill${index}`}
                                                className="p-0   lh-1   "
                                                onClick={() => handleRemoveSkill(index)}
                                            >
                                                <BsX className="fs-5" style={{ strokeWidth: '1.5' }} />
                                            </Button>
                                        </span>
                                    ))}
                                </div>
                            )}
										</Col>
                    <Col xs={12} md={8}>
                        <Form.Group className="mb-3" controlId="skillRequired">
                              <Form.Control
                                    type="text"
                                    className="formInput"
                                    placeholder="e.g., React, Node.js, MongoDB"
                                    name="skill_required"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    isInvalid={!!errors.skill_required}
                                />
													<Form.Control.Feedback type="invalid">{errors.skill_required}</Form.Control.Feedback>
                       </Form.Group>
										</Col>
										<Col xs={12} md={4}>
                         <Button variant="secondary" className="  w-100  mb-3" id="addSkill" title="Add required skill" onClick={handleAddSkill}>
													Add
												</Button>
                            
                            
                    </Col>
                </Row>
                
							{/* Duration and Deadline */}
                <Row  className="w-100   m-0">
                    
                    <Col xs={12} md={6}>
											<Form.Group className="mb-3" controlId="deadline">
												<Form.Label> Application Deadline</Form.Label>
												<Form.Control
													type="date"
													name="deadline"
													className="formInput"
													value={formData.deadline}
													onChange={handleChange}
													min={new Date().toISOString().split('T')[0]}
													isInvalid={!!errors.deadline}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.deadline}
												</Form.Control.Feedback>
											</Form.Group>
										</Col> 
										<Col xs={12} md={6}>
											<Form.Group className="mb-3" controlId="duration">
												<Form.Label>Duration  </Form.Label>
												<Form.Control
													type="text"
													placeholder="e.g., 3 days, 1 week, 3 months"
													name="duration"
													className="formInput"
													value={formData.duration}
													onChange={handleChange}
													isInvalid={!!errors.duration}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.duration}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
                </Row>
								
							

							{/* min-max budget and payment type ($ rupee etc) */}
                <Row  className="w-100   m-0">
                    
                    <Col xs={6} md={6} lg={4}>
											<Form.Group className="mb-3" controlId="budgetMin">
												<Form.Label>  Minimum Budget ($)</Form.Label>
												<Form.Control
													type="number"
													placeholder="e.g., 100"
													name="budget_min"
													className="formInput"
													value={formData.budget_min}
													min="0"
													onChange={handleChange}
													isInvalid={!!errors.budget_min}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.budget_min}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>  
										<Col xs={6} md={6} lg={4}>
											<Form.Group className="mb-3" controlId="budgetMax">
												<Form.Label>  Maximum Budget ($)</Form.Label>
												<Form.Control
													 type="number"
														placeholder="e.g., 500"
														className="formInput"
														name="budget_max"
														value={formData.budget_max}
														min="0"
														onChange={handleChange}
														isInvalid={!!errors.budget_max}
														
													/>
													<Form.Control.Feedback type="invalid">
														{errors.budget_max}
													</Form.Control.Feedback>
											</Form.Group>
										</Col> 
										 <Col xs={12} md={12} lg={4}>
											<Form.Group className="mb-3" controlId="paymentType">
												<Form.Label>Payment Type</Form.Label>
												<Form.Control
													  as="select"
														className="formInput"
														name="payment_type"
														value={formData.payment_type || ''} 
														onChange={handleChange}
														isInvalid={!!errors.payment_type}
														
													 >
													<option value="">Select Payment Type</option> 
													<option value="fixed">Fixed :- One-time payment</option>
													<option value="hourly">Hourly :- Payment based on hours worked</option>
													<option value="retainer">Retainer :- Ongoing monthly payment</option>
													<option value="milestone_based">Milestone-based :- Payment by milestones</option>
													<option value="commission_based">Commission-based :- Incentive-driven</option>
													<option value="equity_based">Equity-based :- Stake in the project</option>
													<option value="revenue_share">Revenue Share :- Payment tied to project earnings</option>
													<option value="time_and_materials">Time and Materials :- Pay for time & resources used</option>
  
			
	
												</Form.Control>
												<Form.Control.Feedback type="invalid">
													{errors.payment_type}
												</Form.Control.Feedback>
												 
											</Form.Group>
										</Col> 
										 
                </Row>
								
								
								<Row  className="w-100   m-0">
                    <Col xs={12}>
                        	{/* Submit Button */}
												<Button type="submit" className="w-100 mt-3 " variant="dark" id="submitFormButton" title="Submit Freelance gig." disabled={submitting}>
													{update ? 'Save changes' : 'Submit'}
											</Button>
                    </Col>
                </Row>
                
            </Form> 
    );
};

export default memo(AddFreelanceWorkForm);
