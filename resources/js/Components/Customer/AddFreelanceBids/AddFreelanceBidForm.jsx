import { memo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TextEditor from '../../Common/TextEditor';

const AddFreelanceBidForm = ({ formData, setFormData, errors,  onSubmit, submitting }) => {
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
	
	// handle add Cover Letter to form data
	const handleCoverLetterChange = (val) => { 
        setFormData((prevData) => ({ ...prevData, cover_letter: val }));
    };
		
  return (
    <Form noValidate onSubmit={onSubmit} autoComplete="off">
      <Row className="w-100 m-0 mt-3">
        {/* Cover Letter Input */}
        <Col xs={12} md={12}>
          <Form.Group className="mb-3" controlId="bidCoverLetter">
            <Form.Label>Cover Letter</Form.Label>
             
						
						<TextEditor
							value={formData.cover_letter || ''}
							onChange={handleCoverLetterChange}
							className={`custom-text-box dark-custom-text-box ${errors.cover_letter && 'border-danger'}`}
							placeholder="Summarize your skills and experience relevant to this project."
						/>
						
						<small className="text-danger mt-1">{errors.cover_letter}</small>
														
														
          </Form.Group>
        </Col>
      </Row>

      <Row className="w-100 m-0">
        {/* Bid Amount Input */}
        <Col xs={12} md={6}>
          <Form.Group className="mb-3" controlId="bidAmount">
            <Form.Label>Bid Amount ($)</Form.Label>
            <Form.Control
              type="number"
              className="bg-transparent reviewformInput"
              placeholder="e.g., 100"
              name="bid_amount"
              value={formData.bid_amount || ''}
              onChange={handleChange}
              isInvalid={!!errors.bid_amount}
							disabled={submitting}
            />
            <Form.Control.Feedback className="text-light" type="invalid">{errors.bid_amount}</Form.Control.Feedback>
          </Form.Group>
        </Col>
				
				{/* Payment Type Input */}
        <Col xs={12} md={6}>
          <Form.Group className="mb-3" controlId="paymentType">
            <Form.Label>Payment Type</Form.Label>
            <Form.Select
              name="payment_type"
							className="bg-transparent reviewformInput "
              value={formData.payment_type || ''}
              onChange={handleChange}
              isInvalid={!!errors.payment_type}
							disabled={submitting}
            >
              <option value="" className="text-dark " > Select Payment Type</option>
              <option value="hourly" className="text-dark " >Hourly</option>
              <option value="fixed" className="text-dark " >Fixed</option>
              <option value="negotiable" className="text-dark " >Negotiable</option>
            </Form.Select>
            <Form.Control.Feedback className="text-light" type="invalid">{errors.payment_type}</Form.Control.Feedback>
          </Form.Group>
        </Col>


        {/* Delivery Time Input */}
        <Col xs={12} md={6}>
          <Form.Group className="mb-3" controlId="deliveryTime">
            <Form.Label>Delivery Time   </Form.Label>
            <Form.Control
              type="text"
              className="bg-transparent reviewformInput"
              placeholder="e.g., 3 days, 1 week, 3 months"
              name="delivery_time"
              value={formData.delivery_time || ''}
              onChange={handleChange}
              isInvalid={!!errors.delivery_time}
							disabled={submitting}
            />
            <Form.Control.Feedback className="text-light" type="invalid">{errors.delivery_time}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

       

      <Row className="w-100 m-0">
        <Col xs={12}>
          {/* Submit Button */}
          <Button variant="light" type="submit"   title="Submit Your Bid" id="submitBidBTN" disabled={submitting}>
          {submitting ? 'Submitting...':'Submit Bid'}
        </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(AddFreelanceBidForm);
