import {memo,useState, useCallback} from 'react'; 
import Button from 'react-bootstrap/Button'; 
//import Dropdown from 'react-bootstrap/Dropdown'
//import { BsThreeDotsVertical, BsTrash3, BsPencil, BsPlus  } from "react-icons/bs"; 
import UpdateJobVacancyTestTimeLimit from '../AddJobVacancyQuestions/UpdateJobVacancyTestTimeLimit';
 import {  BsPencil   } from "react-icons/bs"; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const JobTestQuestions = (
	{ 
		job_id,
		time_limit,
		testQuestions,
		setJobDetail,
	}
) => {
	 const [showTestTimeUpdate, setShowTestTimeUpdate] = useState(false);
	 
 
	const handleNavigateUpdateTestTime = useCallback(() => {
		setShowTestTimeUpdate((prevState) => !prevState); // Toggles the state
	}, []);



  return (
    <div className="    py-2  py-md-3 py-lg-4 px-2  px-md-3 px-lg-4 rounded">
		
		{
			showTestTimeUpdate == true ? (
				 	<UpdateJobVacancyTestTimeLimit 
					job_id={job_id}
					timeLimit={time_limit}
					setJobDetail={setJobDetail}
					handleNavigateUpdateTestTime={
						handleNavigateUpdateTestTime
					}
					/>
					 
			):(
			
				<div className="d-flex flex-wrap gap-2 justify-content-between align-items-center     ">
					<p className="m-0 p-0">
					<strong>Test Time :- </strong>
					<span className=" ">{time_limit} minutes.</span>
					</p>
					<Button 
						variant="dark"
						className="   px-2 py-1 " 
						title="Update test time limit"
						id="goToUpdateTestTime"
						onClick={handleNavigateUpdateTestTime}
						>
						<BsPencil  style={{ strokeWidth: '1.02',  }} />
					</Button>
				</div>
			)
			
		}
		
			
			<hr />
			 <div className="     ">
				<h5>Test Questions</h5>
				 
			 
			</div>
      
      {testQuestions.map((question,index) => (
        <div key={question.id} className="jobDetailTestQuestion">
          
					<p className=" m-0 mb-1">
            <strong 
              className="question-title"  
            >
             {index+1}.  {question.question}
            </strong>
             
          </p>
					
          <ul>
            {question.options.map((option) => (
              <li key={option.id}>
                {option.option}
                {option.is_correct === true && <span className="text-success fw-bold"> (Correct)</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default memo(JobTestQuestions);
