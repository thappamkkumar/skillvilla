import { memo, useCallback, useState } from 'react';
import {useSelector  } from 'react-redux'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';  

import MessageAlert from '../../MessageAlert';


import serverConnection from '../../../CustomHook/serverConnection';
 
const UpdateCompanyProfileContact = ({ 
	address,
	email, 
	phone,
	website, 

}) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	
  const [submitting, setSubmitting] = useState(''); // State for success messages
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [formData, setFormData] = useState({
		address:address,
		email:email, 
		phone:phone,
		website:website,
	});  
	const [errors, setErrors] = useState({}); //state for error message  
	
	 // Handle input changes
    const handleChange = (e) => {
      const { name, value, files } = e.target;
			if (name === 'phone') {
						// Ensure only digits are entered for phone
						const numericValue = value.replace(/\D/g, ''); // Remove non-digit characters
						setFormData((prevData) => ({ ...prevData, [name]: numericValue }));
				} else {
						setFormData((prevData) => ({ ...prevData, [name]: value }));
				}
         
    };
	
	
	// Validate form
    const validateForm = () => {
        const newErrors = {};

         const urlPattern = /^(https?:\/\/)?([\w\d\-_]+(\.[\w\d\-_]+)+)([\w\d\-\._~:/?#[\]@!$&'()*+,;=]*)$/;
        if (!formData.website) {
            newErrors.website = 'Website is required.';
        } else if (!urlPattern.test(formData.website)) {
            newErrors.website = 'Please enter a valid website URL (e.g., https://company.com).';
        }
				
				if (!formData.address) newErrors.address = 'Address is required.';
        
				const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
				
				if (!formData.phone) {
					newErrors.phone = 'Phone number is required.';
				} else if (!/^\d{10}$/.test(formData.phone)) { // Assuming phone is 10 digits
					newErrors.phone = 'Phone number must be 10 digits.';
				}

         

        return newErrors;
    };
		
  // Function to handle basic update
  const handleUpdateBasic = useCallback(async (e) => {
    e.preventDefault();

		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
				setErrors(validationErrors);
		} 
		else 
		{
			try {
				
				setSubmitting(true);
        setErrors({});

			 // Clear any previous error messages
				setSubmitting(true);
					
				const data = await serverConnection(
					'/update-company-contact-detail',
					formData,
					authToken, 
				);
				// console.log(data);

				if (data.status ==  true) 
				{
					
					
					
					setsubmitionMSG('Company contact detail is updated successfully.');
					
	 
				} 
				else 
				{
					setsubmitionMSG(data.message);
					
				} 
				 setShowModel(true);
				 setSubmitting(false);
				
			} 
			catch (error) 
			{
				 
				console.error(error); 
				setsubmitionMSG('An error occurred while updating the contact detail.');
			 
				setShowModel(true); 
				setSubmitting(false);
			}
		}
  }, [ authToken, formData]);

  return (
    <div className="w-100 h-auto  ">
				<MessageAlert
                setShowModel={setShowModel}
                showModel={showModel}
                message={submitionMSG} 
				/>
			
				<h4 className="text-muted" >Contact Detail</h4>
				
				<Form noValidate onSubmit={handleUpdateBasic} autoComplete="off">
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
																 disabled={submitting}
                            />
                            <Form.Control.Feedback type="invalid">{errors.website}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
								
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
																 disabled={submitting}
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
																 disabled={submitting}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
								
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
																 disabled={submitting}
                            />
                            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
								
								
									
										<Col xs={12} md={12}>
											<Button
                            type="submit"
                            className="  mt-2 px-4  "
                            variant="dark"
                            id="submitFormButton"
                            title="Upload company profile"
                            disabled={submitting}
                        >
                            {submitting && <Spinner  animation="border" variant="light" size="sm"/>  }
														<span className={` ${submitting && 'ps-3'} `}>Update</span>
                        </Button>
									</Col>
										
                </Row>
			 
			 </Form>
    </div>
  );
};

export default memo(UpdateCompanyProfileContact);
