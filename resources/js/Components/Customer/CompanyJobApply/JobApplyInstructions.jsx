 
import { Container, Row, Col, Card, Button, ListGroup, Alert } from "react-bootstrap";
import { BsCheckCircleFill , BsExclamationCircleFill , BsUpload, BsCameraVideoFill , BsPencilSquare, BsCheckSquare  } from "react-icons/bs";


const JobApplyInstructions = ({ 
	alreadyTestCompleted,
	handleShowApplyPage
}) => {
	
	 
	
  

  return (
    <Container className="py-4">
      <Card className="sub_main_container">
        <Card.Header as="h5" className="job-apply-instruction-header text-white text-center">
          <BsExclamationCircleFill  className="me-2" />
          Instructions Before Applying
        </Card.Header>
        <Card.Body>
          <Alert variant="info" className="text-center">
            Please read the following instructions carefully before proceeding with the job application.
          </Alert>
          <Row className="mb-4">
            <Col md={6}>
              <h5 className={`${alreadyTestCompleted != null ? 'text-success':'question-title '} mb-3`}>
								{alreadyTestCompleted != null ? <BsCheckSquare  className="me-2" />:<BsPencilSquare className="me-2" />}
                
                Step 1: Answer Questions
              </h5>
              <p>
                You must answer all the job-related questions accurately. This step ensures your eligibility for the role.
              </p>
							{alreadyTestCompleted != null &&  
								<div>
									<p>
										<strong className={`${alreadyTestCompleted.status ? 'text-success' : 'text-danger'}`}>
											{alreadyTestCompleted.status 
												? "Well done! You've cleared the test." 
												: "Test not passed. Keep improving!"}
										</strong>
									</p>
									<p>
										<strong className={`${alreadyTestCompleted.status ? 'text-success' : 'text-danger'}`}>
											Score: {alreadyTestCompleted.score} %
										</strong>
									</p>

								</div>
							}
            </Col>
            <Col md={6}>
              <h5 className="question-title mb-3">
                <BsUpload className="me-2" />
                Step 2: Meet Application Requirements
              </h5>
              <p>
                Make sure you have the following ready before applying:
              </p>
              <ListGroup>
                <ListGroup.Item>
                  <BsCheckCircleFill  className="text-success me-2" />
                  Updated Resume
                </ListGroup.Item>
                <ListGroup.Item>
                  <BsCameraVideoFill  className="text-danger me-2" />
                  Introduction Video
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="text-center">
              <Button
                variant="success"
                size="lg"
                onClick={handleShowApplyPage}
                className="jobApplyBTN px-4"
								title={alreadyTestCompleted && alreadyTestCompleted.status === false ? "You are not eligible to apply for this job" : "Apply for job"}
								id="jobApplybtn"
								disabled={alreadyTestCompleted !== null   && alreadyTestCompleted.status === false}
              >
                 {alreadyTestCompleted !== null && alreadyTestCompleted.status === false 
										? 'You are not eligible to apply for the job' 
										: 'Apply for the Job'
									}
              </Button>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          Please complete all steps before proceeding with your application.
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default JobApplyInstructions;
