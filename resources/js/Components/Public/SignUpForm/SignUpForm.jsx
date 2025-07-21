import {memo}from 'react';
import { Form, Button  } from 'react-bootstrap';
import NameComponent from './SignUpFormComponents/NameComponent';
import EmailVerificationComponent from './SignUpFormComponents/EmailVerificationComponent';


const SignUpForm = ({ handleSubmit, handleChange, values, touched, errors, isSubmitting, setsubmitionMSG, setShowModel,   }) => {
 

 return (
    <Form noValidate onSubmit={handleSubmit}>
      
			<NameComponent handleChange={handleChange} name={values.name} touched = {touched} errors = {errors} />
			
			<EmailVerificationComponent handleChange={handleChange} email={values.email} touched = {touched} errors = {errors} setsubmitionMSG={setsubmitionMSG}  setShowModel={setShowModel} />
 
				 
			 
    </Form>
  );
};

export default  memo(SignUpForm);
