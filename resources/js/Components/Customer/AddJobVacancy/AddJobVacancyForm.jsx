import { memo, useState } from 'react';
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BsX   } from 'react-icons/bs'; 
 
import TextEditor from '../../Common/TextEditor';

const AddJobVacancyForm = ({ formData, setFormData, errors, setErrors, onSubmit, submitting, update=false }) => {
	 // State for the new skill input field
    const [newSkill, setNewSkill] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            if (name === 'phone') {
                // Ensure only digits are entered for phone
                const numericValue = value.replace(/\D/g, ''); // Remove non-digit characters
                setFormData((prevData) => ({ ...prevData, [name]: numericValue }));
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: value }));
            }
        }
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
                    <Col xs={12} md={12}  >
                        <Form.Group className="mb-3" controlId="jobTitle">
                            <Form.Label>Job Title </Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., Software Engineer"
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
                
                    {/* Salary Input */}
                    <Col xs={12} md={6}  >
                        <Form.Group className="mb-3" controlId="jobSalary">
                            <Form.Label>Salary ($)</Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., 5000, 100k-150k"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                isInvalid={!!errors.salary}
                            />
                            <Form.Control.Feedback type="invalid">{errors.salary}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
										
										{/* payment type*/}
                    <Col xs={12} md={6}  >
                        <Form.Group className="mb-3" controlId="jobPaymentType">
                            <Form.Label>Payment Type</Form.Label>
                            <Form.Control
                                as="select"
                                className="formInput" 
                                name="payment_type"
                                value={formData.payment_type}
                                onChange={handleChange}
                                isInvalid={!!errors.salary}
                            >
														<option value="">Select Payment Type</option> 
															 <option value="hourly">Hourly</option>
															<option value="daily">Daily</option>
															<option value="monthly">Monthly</option>
															<option value="yearly">Yearly</option>
															 
													</Form.Control>
														
                            <Form.Control.Feedback type="invalid">{errors.salary}</Form.Control.Feedback>
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
															placeholder="Describe the job responsibilities and expectations.."
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
                                <div className="d-flex flex-wrap pb-2 tech_skill_container">
                                    {formData.skill_required.map((skill, index) => (
                                        <span key={index} className="border border-0 mx-1 my-1 p-1 px-2 rounded tech_skill">
                                            <span className="pe-3">{skill}</span>
                                            <Button
                                                variant="danger"
                                                title={`remove skill ${index}`}
                                                id={`removeSkill${index}`}
                                                className="p-0 lh-1"
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
                         <Button variant="secondary" className="  w-100   mb-3" id="addSkill" title="Add required skill" onClick={handleAddSkill}>
													Add
												</Button>
                            
                            
                    </Col>
                </Row>
                <Row  className="w-100   m-0">
                    {/* Job Location Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="jobLocation">
                            <Form.Label>Job Location</Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., New York, USA"
                                name="job_location"
                                value={formData.job_location}
                                onChange={handleChange}
                                isInvalid={!!errors.job_location}
                            />
                            <Form.Control.Feedback type="invalid">{errors.job_location}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    {/* Employment Type Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="employmentType">
                            <Form.Label>Employment Type</Form.Label>
                            <Form.Control
                                as="select"
                                className="formInput"
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleChange}
                                isInvalid={!!errors.employment_type}
                            >
                                <option value="">Select Employment Type</option>
                                <option value="full_time">Full-Time</option>
                                <option value="part_time">Part-Time</option>
                                <option value="internship">Internship</option>
                                <option value="contract">Contract</option> 
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.employment_type}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row  className="w-100   m-0">
                    {/* Expires At Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="expiresAt">
                            <Form.Label>Application Deadline</Form.Label>
                            <Form.Control
                                type="date"
                                className="formInput"
                                name="expires_at"
                                value={formData.expires_at}
                                onChange={handleChange}
                                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                                isInvalid={!!errors.expires_at}
                            />
                            <Form.Control.Feedback type="invalid">{errors.expires_at}</Form.Control.Feedback>
                        </Form.Group>
												
                    </Col>

                   
                 
                    {/* Email Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="jobEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                className="formInput"
                                placeholder="e.g., hr@company.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    {/* Phone Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="jobPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., 555-555-5555"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                isInvalid={!!errors.phone}
                            />
                            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                
                    {/* Communication Language Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="communicationLanguage">
                            <Form.Label>Communication Language</Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., English, Spanish"
                                name="communication_language"
                                value={formData.communication_language}
                                onChange={handleChange}
                                isInvalid={!!errors.communication_language}
                            />
                            <Form.Control.Feedback type="invalid">{errors.communication_language}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    {/* Work From Home Checkbox */}
                    <Col xs={12} md={6}>
                        <Form.Check type="checkbox" className="py-2" controlId="work_from_home_id">
                            
                            <Form.Check.Label className="login_check_label"  >
														<Form.Check.Input
                                type="checkbox"
                                className="login_check"
                                id="WorkFromHome"
                                name="work_from_home"
                                value={true}
                                checked={formData.work_from_home === true}
                                onChange={handleChange}
                            />
                                Work from home
                            </Form.Check.Label>
                        </Form.Check>
                    </Col>
                     
                </Row>
								<Row  className="w-100   m-0">
                    <Col xs={12}>
                        	{/* Submit Button */}
												<Button type="submit" className="w-100 mt-3  " variant="dark" id="submitFormButton" disabled={submitting}>
												{update ? 'Save changes' : 'Submit'}
											</Button>
                    </Col>
                </Row>
                
            </Form> 
    );
};

export default memo(AddJobVacancyForm);
