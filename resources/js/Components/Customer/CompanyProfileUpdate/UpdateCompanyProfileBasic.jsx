import { memo, useCallback, useState } from 'react';
import {useSelector  } from 'react-redux'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';  

import MessageAlert from '../../MessageAlert';


import serverConnection from '../../../CustomHook/serverConnection';
 
const UpdateCompanyProfileBasic = ({ 
	name,
	industry, 
	establishedYear,  

}) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	
  const [submitting, setSubmitting] = useState(''); // State for success messages
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [formData, setFormData] = useState({
		name:name,
		industry:industry, 
		established_year:establishedYear,
	});  
	const [errors, setErrors] = useState({}); //state for error message  
	
	 // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
				setFormData((prevData) => ({ ...prevData, [name]: value }));
             
        
    };
	
	
	// Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Name is required.';
         

        if (!formData.industry) newErrors.industry = 'Industry is required.';
        
        if (!formData.established_year) newErrors.established_year = 'Established year is required.';
         

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
					'/update-company-basic-detail',
					formData,
					authToken, 
				);
				 //console.log(data);

				if (data.status ==  true) 
				{
					
					
					
					setsubmitionMSG('Company basic detail is updated successfully.');
					
	 
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
				setsubmitionMSG('An error occurred while updating the basic detail.');
			 
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
			<h4 className="text-muted" >Basic Detail</h4>
			<Form noValidate onSubmit={handleUpdateBasic} autoComplete="off">
					<Row  className="w-100   m-0">
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
													disabled={submitting}
											/>
											<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
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
														disabled={submitting}
												/>
												<Form.Control.Feedback type="invalid">{errors.industry}</Form.Control.Feedback>
										</Form.Group>
								</Col>
								
								
								{/* established year Input */}
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
														disabled={submitting}
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

export default memo(UpdateCompanyProfileBasic);
