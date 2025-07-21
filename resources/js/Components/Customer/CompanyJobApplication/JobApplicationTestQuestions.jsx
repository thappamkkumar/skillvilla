import { memo } from 'react'; 
import { BsCheckCircle, BsXCircle } from "react-icons/bs"; 

const JobApplicationTestQuestions = ({ testAttempt, testQuestions }) => {
  if (testAttempt == null) {
    return (
      <div className="jobDetailTestQuestionContainer py-2 py-md-3 py-lg-4 px-2 px-md-3 px-lg-4 rounded">
        <p>
          The candidate applied for the job before the test was added. The test questions were added after the application was submitted. 
          You can review the application based on the absence of test responses.
        </p>
      </div>
    );
  }

  return (
    <div className="jobDetailTestQuestionContainer py-2 py-md-3 py-lg-4 px-2 px-md-3 px-lg-4 rounded">
      <div>
        <h5>Test Questions</h5>
      </div>

      {testQuestions.map((question, index) => {
        // Find the corresponding answer for the current question from testAttempt
        const answer = testAttempt.answers.find(a => a.question_id === question.id);
        const selectedOption = question.options.find(option => option.id === answer?.selected_option_id);
         // Flag to indicate if the question was added after the test
        const isAddedAfterTest = answer == null;
				
        return (
          <div key={question.id} className="jobDetailTestQuestion">
            <p className=" m-0 mb-1 ">
              <strong className=" ">{index+1}. {question.question}</strong>
             {isAddedAfterTest && <span className="text-secondary ms-2">(Added after test)</span>}
            </p>

            <ul>
              {question.options.map((option) => {
                // Check if the option is selected and correct/incorrect
                const isSelected = selectedOption?.id === option.id;
                const isCorrect = option.is_correct;
                 
                return (
                  <li key={option.id} className={`option ${isSelected ? (isCorrect ? 'text-success' : 'text-danger') : (isCorrect && 'text-success') }`}>
                    {/* Bold only for the selected option */}
                    {isSelected ? (
                      <strong>{option.option}</strong>
                    ) : (
                      <span>{option.option}</span>
                    )}

                    {/* If the selected option is correct, show the check icon */}
                    {isSelected  && (
                      <BsCheckCircle className={`${ isCorrect ? 'text-success' : 'text-danger' }  ms-2`} />
                    )}

                     
										{/* Only show the correct option text if it's not selected */}
                    {!isSelected && isCorrect && (
                      <small className="text-success ms-2">(correct)</small>
                    )}
                    
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
			
		{/* Note Section */}
      <div className="mt-4">
        <p><strong>Note:</strong></p>
        <ul className="list-unstyled">
          <li>
            <BsCheckCircle className="text-success" /> Indicates the selected option.
          </li>
          <li>
            <strong className="text-success">Green and bold text</strong> indicates that the selected option is correct.
          </li>
          <li>
            <strong className="text-danger">Red and bold text</strong> indicates that the selected option is wrong.
          </li>
          <li>
            <small className="text-success">(correct)</small> in simple green text indicates the correct option, but it was not selected.
          </li>
        </ul>
      </div>
			
			
    </div>
  );
};

export default memo(JobApplicationTestQuestions);
