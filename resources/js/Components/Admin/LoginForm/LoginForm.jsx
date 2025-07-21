import {memo} from 'react';
import { Form, Button, InputGroup, Container } from 'react-bootstrap';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const LoginForm = ({ handleSubmit, handleChange, values, touched, errors, isSubmitting, showPassword, togglePasswordVisibility   }) => {
  return (
    <Form noValidate onSubmit={handleSubmit}>
      {/* Email field */}
      <Form.Group className="py-2" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" className="login_input" placeholder="Enter email" name="email" value={values.email} onChange={handleChange} isInvalid={touched.email && !!errors.email} autoComplete="email" />
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
      </Form.Group>

      {/* Password field */}
      <Form.Group className="pt-2" controlId="password">
        <Form.Label>Password</Form.Label>
        <InputGroup className=" ">
          <Form.Control type={showPassword ? 'text' : 'password'} className="rounded login_input" placeholder="Password" name="password" value={values.password} onChange={handleChange} isInvalid={touched.password && !!errors.password} autoComplete="current-password" />
          {values.password !== '' && (
            <Button variant=" " className="py-0" style={{ position: 'absolute', right: '3px', top: '4px', height: '30px', zIndex: '6', background:'#fff'}}  onClick={togglePasswordVisibility}>
              {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
            </Button>
          )}
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

			 
 
			
			
			
      {/* Submit button */}
      <Button type="submit" variant="dark" className="mt-4	 w-100 fw-bold   " id="submit_btn_id" title="Submit login information." disabled={isSubmitting}>
        {isSubmitting ? 'Logging...' : 'Login'}
      </Button>
    </Form>
  );
};

export default memo(LoginForm);
