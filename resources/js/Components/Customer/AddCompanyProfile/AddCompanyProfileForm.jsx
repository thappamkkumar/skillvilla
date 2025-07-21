import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TextEditor from '../../Common/TextEditor';

const AddCompanyProfileForm = ({ formData, setFormData, errors, setErrors, onSubmit, submitting }) => {
    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];

            if (name === 'logo') {
                setErrors({});
                // Validate file type and size (only JPG/PNG allowed, max size 2MB)
                const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                const maxFileSize = 2 * 1024 * 1024; // 2MB

                if (!allowedTypes.includes(file.type)) {
                    setErrors({ logo: 'Invalid file type. Only JPG, JPEG and PNG are allowed.' });
                } else if (file.size > maxFileSize) {
                    setErrors({ logo: 'File size exceeds 2MB.' });
                } else {
                    setFormData((prevData) => ({
                        ...prevData,
                        logo: file,
                    }));
                }
            }
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
		
		// handle add about to form data
		const handleAboutChange = (val) => { 
        setFormData((prevData) => ({ ...prevData, description: val }));
    };
		
		
    return ( 
            <Form noValidate onSubmit={onSubmit} autoComplete="off">
                <Row  className="w-100   m-0">
                    {/* Logo Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="companyLogo">
                            <Form.Label>Logo <small className="text-danger">*</small></Form.Label>
                            <Form.Control
                                type="file"
                                className="formInput"
                                name="logo"
                                accept="image/jpg,image/jpeg,image/png"
                                onChange={handleChange}
                                isInvalid={!!errors.logo}
                            />
                            <Form.Control.Feedback type="invalid">{errors.logo}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    {/* Name Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="companyName">
                            <Form.Label>Name <small className="text-danger">*</small></Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., ABC Tech Corp"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row  className="w-100   m-0">
                    {/* Description Input */}
                    <Col xs={12}>
                        <Form.Group className="mb-3" controlId="companyDescription">
                            <Form.Label>About <small className="text-danger">*</small></Form.Label>
                             
														
														<TextEditor
															value={formData.description}
															onChange={handleAboutChange}
															className={`custom-text-box ${errors.description && 'border-danger'}`}
															placeholder="Provide a brief overview of your company and its culture..."
														/>
														 
														<small className="text-danger mt-1">{errors.description}</small>
														
                        </Form.Group>
                    </Col>
                </Row>

                <Row  className="w-100   m-0">
                    {/* Website Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="companyWebsite">
                            <Form.Label>Website <small className="text-danger">*</small></Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., https://www.company.com"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                isInvalid={!!errors.website}
                            />
                            <Form.Control.Feedback type="invalid">{errors.website}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    {/* Industry Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="companyIndustry">
                            <Form.Label>Industry <small className="text-danger">*</small></Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., Technology, Healthcare, Finance"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                isInvalid={!!errors.industry}
                            />
                            <Form.Control.Feedback type="invalid">{errors.industry}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row  className="w-100   m-0">
                    {/* Address Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="companyAddress">
                            <Form.Label>Address <small className="text-danger">*</small></Form.Label>
                            <Form.Control
                                type="text"
                                className="formInput"
                                placeholder="e.g., 123, MG Road, Bangalore"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                isInvalid={!!errors.address}
                            />
                            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    {/* Email Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="companyEmail">
                            <Form.Label>Email <small className="text-danger">*</small></Form.Label>
                            <Form.Control
                                type="email"
                                className="formInput"
                                placeholder="e.g., info@company.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row  className="w-100   m-0">
                    {/* Phone Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="companyPhone">
                            <Form.Label>Phone <small className="text-danger">*</small></Form.Label>
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

                    {/* Established Year Input */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="companyEstablishedYear">
                            <Form.Label>Established Year <small className="text-danger">*</small></Form.Label>
                            <Form.Control
                                as="select"
                                className="formInput"
                                name="established_year"
                                value={formData.established_year}
                                onChange={handleChange}
                                isInvalid={!!errors.established_year}
                            >
                                <option className="text-muted" value="">Select Year</option>
                                {Array.from({ length: 100 }, (_, index) => {
                                    const year = new Date().getFullYear() - index; // Generate years from the current year back 100 years
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.established_year}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row  className="w-100   m-0">
                    <Col xs={12}>
                        <Button
                            type="submit"
                            className="w-100 mt-3  "
                            variant="dark"
                            id="submitFormButton"
                            title="Upload company profile"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Col>
                </Row>
            </Form> 
    );
};

export default memo(AddCompanyProfileForm);
