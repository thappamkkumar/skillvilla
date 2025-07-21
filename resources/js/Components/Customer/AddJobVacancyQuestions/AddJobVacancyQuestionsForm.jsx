import React, { useState } from "react";
import { Form, Button, Col, Row,Container } from "react-bootstrap"; 

import TextEditor from '../../Common/TextEditor';

const AddJobVacancyQuestionsForm = (
{
	question,
	timeLimit,
	options,
	correctAnswer,
	errors,
	handleSubmit,
	setQuestion,
	updateTimeLimit,
  setOptions,
  setCorrectAnswer
	
}) => {
  
	//  question onChange handlers
  const handleQuestionChange = (val) => {
    setQuestion(val);  
  };
	//  question time limit onChange handlers
	const handleTimeLimitChange = (e) => {
		updateTimeLimit(e.target.value); // Update parent's state
	};
	//  question option onChange handlers
  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value, // Update parent's state for options
    }));
  };
	//  question  correct option   onChange handlers
  const handleCorrectAnswerChange = (e) => {
    setCorrectAnswer(e.target.value); // Update parent's state
  };

 
  return (
	<Form onSubmit={handleSubmit} autoComplete="off">
		{
			timeLimit === ""  || timeLimit == 1  &&
			<Row className="w-100   m-0"> 
				 <Col xs={12} md={12} className="mb-3">
					<Form.Group controlId="minutes">
						<Form.Label>Time Limit (in minutes) for this question
						<strong className="text-danger ps-3">*</strong>
						</Form.Label>
						<Form.Select  
							className="formInput"
							value={timeLimit}  
							onChange={handleTimeLimitChange}  
							isInvalid={!!errors.timeLimit}
						>
							 <option value="" disabled>Select time limit</option>
							{[...Array(60).keys()].map((minute) => (
								<option key={minute + 1} value={minute + 1}>
									{minute + 1}
								</option>
							))}
							<option  disabled> </option>
						</Form.Select>
						<Form.Control.Feedback type="invalid">{errors.timeLimit}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
		}
			
	
			<Row className="w-100   m-0">
				 <Col xs={12} md={12} className="mb-3">
					{/* Question Input */}
					<Form.Group controlId="question" className="pb-3">
						<Form.Label>Question <strong className="text-danger ps-3">*</strong></Form.Label>
						 
						<TextEditor
								value={question}
								onChange={handleQuestionChange}
								className={`custom-text-box ${errors.question && 'border-danger'}`}
								placeholder="Enter your question.."
							/>
							
							<small className="text-danger mt-1">{errors.question}</small>
						
					</Form.Group>
				 </Col>
				 
			</Row>
      {/* Options Input */}
      <Row className="w-100   m-0">
         <Col xs={12} md={6} className="mb-3">
          <Form.Group controlId="option1">
            <Form.Label>Option 1<strong className="text-danger ps-3">*</strong></Form.Label>
            <Form.Control
              type="text"
              name="option1"
							className="formInput"
              value={options.option1}
              onChange={handleOptionChange} // Handle change in child
              isInvalid={!!errors.option1}
            />
            <Form.Control.Feedback type="invalid">{errors.option1}</Form.Control.Feedback>
          </Form.Group>
        </Col>
         <Col xs={12} md={6} className="mb-3">
          <Form.Group controlId="option2">
            <Form.Label>Option 2 <strong className="text-danger ps-3">*</strong></Form.Label>
            <Form.Control
              type="text"
              name="option2"
							className="formInput"
              value={options.option2}
              onChange={handleOptionChange} // Handle change in child
              isInvalid={!!errors.option2}
            />
            <Form.Control.Feedback type="invalid">{errors.option2}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

     <Row className="w-100   m-0">
         <Col xs={12} md={6} className="mb-3">
          <Form.Group controlId="option3">
            <Form.Label>Option 3<strong className="text-danger ps-3">*</strong></Form.Label>
            <Form.Control
              type="text"
              name="option3"
							className="formInput"
              value={options.option3}
              onChange={handleOptionChange} // Handle change in child
              isInvalid={!!errors.option3}
            />
            <Form.Control.Feedback type="invalid">{errors.option3}</Form.Control.Feedback>
          </Form.Group>
        </Col>
         <Col xs={12} md={6} className="mb-3">
          <Form.Group controlId="option4">
            <Form.Label>Option 4 <strong className="text-danger ps-3">*</strong></Form.Label>
            <Form.Control
              type="text"
              name="option4"
							className="formInput"
              value={options.option4}
              onChange={handleOptionChange} // Handle change in child
              isInvalid={!!errors.option4}
            />
            <Form.Control.Feedback type="invalid">{errors.option4}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
			
			<Row className="w-100   m-0">
				 <Col xs={12} md={12} className="mb-3">
					{/* Correct Answer Selection */}
					<Form.Group controlId="correctAnswer" className="pb-3">
						<Form.Label>Correct Answer<strong className="text-danger ps-3">*</strong></Form.Label>
						<Form.Control
							as="select"
							className="formInput"
							value={correctAnswer}
							onChange={handleCorrectAnswerChange} // Handle change in child
							isInvalid={!!errors.correctAnswer}
						>
							<option value="">Select correct answer</option>
							<option value="option1">Option 1</option>
							<option value="option2">Option 2</option>
							<option value="option3">Option 3</option>
							<option value="option4">Option 4</option>
						</Form.Control>
						<Form.Control.Feedback type="invalid">{errors.correctAnswer}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row className="w-100   m-0">
				<Col xs={12} md={12} className="mb-3">
					<Button type="submit" className="w-100 mt-3  " variant="dark" id="uploadQuestion" title="Upload question">
						Add
					</Button>
				 </Col>
			</Row>
    </Form>
  );
};

export default AddJobVacancyQuestionsForm;
