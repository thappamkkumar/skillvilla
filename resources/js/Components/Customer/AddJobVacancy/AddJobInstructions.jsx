import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { 
  BsCheckCircleFill, 
  BsExclamationCircleFill, 
  BsPencilSquare, 
  BsListCheck 
} from "react-icons/bs";

const AddJobInstructions = ({ handleGoToStepOne }) => {
  return (
    <Container className="     ">
      <Card className="sub_main_container">
        <Card.Header as="h5" className="job-apply-instruction-header text-white text-center">
          <BsExclamationCircleFill className="me-2" />
          Instructions for Adding a Job
        </Card.Header>
        <Card.Body>
          <Alert variant="info" className="text-center">
            Please follow these steps carefully to add a new job.
          </Alert>
          <Row className="mb-4">
            <Col md={6}>
              <h5 className="question-title mb-3">
                <BsPencilSquare className="me-2" />
                Step 1: Enter Job Information
              </h5>
              <p>
                Fill out all the job-related information, such as job title, description, location, salary, and other details. These details are essential for listing the job.
              </p>
            </Col>
            <Col md={6}>
              <h5 className="question-title mb-3">
                <BsListCheck className="me-2" />
                Step 2: Add Job-Related Questions (Optional)
              </h5>
              <p>
                Optionally, you can add specific questions for applicants. These questions can help you filter candidates during the application process.
              </p>
              
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGoToStepOne}
                className="primaryBTN px-4"
                title="Proceed to Step 1"
              >
                Start Adding Job
              </Button>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          Complete the steps to successfully add a job to your platform.
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default AddJobInstructions;
