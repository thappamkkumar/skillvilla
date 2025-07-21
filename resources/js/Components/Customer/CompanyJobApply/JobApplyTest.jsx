import { useState, useEffect, useCallback} from "react";
import {useDispatch } from 'react-redux';   
import { Container, Button, Card, Form, ListGroup } from "react-bootstrap";
import serverConnection from '../../../CustomHook/serverConnection'; 
import {updateJobState as updateUserJobState} from '../../../StoreWrapper/Slice/UserJobSlice';


const basicSanitize = (html) => {
  return html
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/on\w+=".*?"/gi, '')
    .replace(/javascript:/gi, '');
};


const JobApplyTest = ({
	testQuestions, 
	timeLimit = 30,
	setsubmitionMSG,
	setShowModel, 
	job_id,
	authToken,
	setAlreadyTestCompleted,
	setShouldNavigateToNextStep,
	}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Use an array instead of an object
  const [remainingTime, setRemainingTime] = useState(timeLimit * 60);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [testSubmitting, setTestSubmitting] = useState(false);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	// Timer for the whole test (applies the same time limit to all
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleFinish();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

	// Handle selection of answer
  const handleAnswerChange = (questionId, selectedOptionId) => {
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.question_id === questionId
      );

      if (existingAnswerIndex !== -1) {
        // Update the existing answer
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].selected_option_id = selectedOptionId;
        return updatedAnswers;
      } else {
        // Add a new answer
        return [
          ...prevAnswers,
          { question_id: questionId, selected_option_id: selectedOptionId },
        ];
      }
    });
	
		// Mark question as completed
    if (!completedQuestions.includes(questionId)) {
      setCompletedQuestions([...completedQuestions, questionId]);
    }
  };
	
	
	 // Handle navigation to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
	
	
	// Handle navigation to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = useCallback(async() => {
		
		 try 
		 { 
				if(authToken == null || job_id == null){return;}
				setTestSubmitting(true);
				
				// Calculate the number of correct answers
				let correctAnswersCount = 0;

				testQuestions.forEach((question) => {
					const userAnswer = answers.find(
						(answer) => answer.question_id === question.id
					);
					const correctOption = question.options.find((option) => option.is_correct);

					if (userAnswer?.selected_option_id === correctOption?.id) {
						correctAnswersCount += 1;
					}
				});

				// Calculate the average score
				const averageScore = Math.round(
					(correctAnswersCount / testQuestions.length) * 100
				);
				
				const formData =  {
					job_id:job_id,
					score:averageScore,
					answers:answers,
				};
				const resultData = await serverConnection('/upload/job-test/attempt',formData, authToken); 
			 //console.log(resultData);
				if(resultData != null && resultData.status == true)
				{
					setTestSubmitting(false);
					setAlreadyTestCompleted(resultData.attempt);
					dispatch(updateUserJobState({type : 'updateJobAttempts', attemptData: {
						job_id:job_id,attempt:resultData.attempt
					}}));
					setShouldNavigateToNextStep(2);
					setsubmitionMSG('Job eligibility test completed successfully.');
					setShowModel(true);
					
				}
				else{
					setTestSubmitting(false);
					setShouldNavigateToNextStep(0);
					setsubmitionMSG('Something went wrong. Please try again.');
					setShowModel(true);
				}
				 
			 
		 }catch (error) {
       console.error(error);
			setTestSubmitting(false);
			setShouldNavigateToNextStep(0);
			setsubmitionMSG('An error occurred. Please try again.');
			setShowModel(true);
			 
    }
     
		// Perform any action like API call here
	},[job_id, authToken, testQuestions,  answers,]);

	 // Convert remaining time (in seconds) to mm:ss format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  };

  const currentQuestion = testQuestions[currentQuestionIndex];

	if(testSubmitting == true)
	{
		 return (
			<div className="no_posts_message">
					<p>Your submission is being processed. Please wait a moment.</p>
			</div>
		 );
	}
 
  return (
    <Container className="py-4">
      <h3 className="fw-bold mb-3">Job Eligibility Test</h3>
      <Card>
        <Card.Body>
					<div  
					dangerouslySetInnerHTML={{ __html: basicSanitize(currentQuestion.question) }}
				/>
          
          <p>Time Remaining: {formatTime(remainingTime)}</p>
          <Form>
            <ListGroup>
              {currentQuestion.options.map((option) => (
                <ListGroup.Item
                  key={option.id}
                  className={`custom_radio ${
                    answers.find(
                      (answer) =>
                        answer.question_id === currentQuestion.id &&
                        answer.selected_option_id === option.id
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleAnswerChange(currentQuestion.id, option.id)
                  }
                >
                  <Form.Check
                    type="radio"
                    label={option.option}
                    className="p-0"
                    id={`question-${currentQuestion.id}-option-${option.id}`}
                    name={`question-${currentQuestion.id}`}
                    checked={
                      answers.find(
                        (answer) =>
                          answer.question_id === currentQuestion.id &&
                          answer.selected_option_id === option.id
                      ) !== undefined
                    }
                    onChange={() =>
                      handleAnswerChange(currentQuestion.id, option.id)
                    }
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form>
          <div className="mt-3">
            {currentQuestionIndex > 0 && (
              <Button
                variant="outline-secondary"
                className="  px-4 m-1"
                title="Previous question"
                id="previousQuestionBtn"
                onClick={handlePreviousQuestion}
              >
                Previous
              </Button>
            )}
            {currentQuestionIndex < testQuestions.length - 1 && (
              <Button
                variant="outline-secondary"
                className="  px-4 m-1"
                title="Next question"
                id="nextQuestionBtn"
                onClick={handleNextQuestion}
              >
                Next
              </Button>
            )}
						
						{
							completedQuestions.length === testQuestions.length && 
							currentQuestionIndex === testQuestions.length - 1 &&
							(
								<Button
									variant="dark"
									className="  px-4 m-1"
									title="Finish test"
									id="finishTestBtn"
									onClick={handleFinish}
									disabled={completedQuestions.length < testQuestions.length}
								>
									Finish
								</Button>
							 
							)
						}
					
          </div>
          <div className="mt-3">
            <p>
              Completed Questions: {completedQuestions.length} /{" "}
              {testQuestions.length}
            </p>
          </div>
          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JobApplyTest;
