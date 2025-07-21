import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'; 

import MessageAlert from '../../MessageAlert';
	
	
const ContactMessage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	
	
	
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty.';
    return newErrors;
  };

  const handleSubmit = useCallback( async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSending(true);

    try {
      // Simulate sending data
      const url = window.location.origin + '/send-contact-message';
			const response = await axios.post(url, formData);
			//console.log(response);
			
			if(response?.data?.message)
			{
				setsubmitionMSG(response.data.message);
				setFormData({ name: '', email: '', message: '' });				
			}
			else
			{
				setsubmitionMSG(response.data.message || 'Fail to send message. Please try again later.'); 
			}
       
       
      
    } 
		catch (error) 
		{
      //console.log('Submission error:', error);
      setsubmitionMSG( 'Oops! Something went wrong. Please try again later.');  
    } 
		finally 
		{
			setShowModel(true);
      setIsSending(false);
    }
  }, [formData]);

  return (
		<>
			<Form onSubmit={handleSubmit} autoComplete="off">
				 

				<Form.Group controlId="formName" className="mb-3">
					<Form.Label>Your Name</Form.Label>
					<Form.Control
						type="text"
						name="name"
						className="login_input"
						placeholder="John Doe"
						value={formData.name}
						onChange={handleChange}
						 
						autoComplete="off"
						isInvalid={!!errors.name}
					/>
					<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
				</Form.Group>

				<Form.Group controlId="formEmail" className="mb-3">
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type="email"
						name="email"
						className="login_input"
						placeholder="john@example.com"
						value={formData.email}
						onChange={handleChange}
						
						autoComplete="off"
						isInvalid={!!errors.email}
					/>
					<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
				</Form.Group>

				<Form.Group controlId="formMessage" className="mb-3">
					<Form.Label>Your Message</Form.Label>
					<Form.Control
						as="textarea"
						name="message"
						className="login_input"
						rows={4}
						placeholder="Type your message here..."
						value={formData.message}
						onChange={handleChange}
						 
						autoComplete="off"
						isInvalid={!!errors.message}
					/>
					<Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
				</Form.Group>

				<div className="mt-3 ">
					<Button
						variant="dark"
						type="submit"
						id="sendMessageBTN"
						title="Send Message"
						className="px-4"
						disabled={isSending}
					>
						{isSending ? (
							<>
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									aria-hidden="true"
								/>{' '}
								Sending...
							</>
						) : (
							'Send'
						)}
					</Button>
				</div>
			</Form>
			 <MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
		</>
  );
};

export default ContactMessage;
