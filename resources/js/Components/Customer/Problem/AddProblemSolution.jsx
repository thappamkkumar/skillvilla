import { useState, useCallback, memo, useRef } from 'react'; 
import {useSelector, useDispatch } from 'react-redux'; 
import { Form, Button } from 'react-bootstrap';
import { BsStar, BsStarFill } from 'react-icons/bs';

import {updateProblemState} from '../../../StoreWrapper/Slice/ProblemSlice';
import {updateProblemState as updateUserProblemState} from '../../../StoreWrapper/Slice/UserProblemSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';

import TextEditor from '../../Common/TextEditor'; 
import MessageAlert from '../../MessageAlert';

const AddProblemSolution = ({ problem_id, setProblemSolutionList, updateProblemSolutionCount }) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 
  const [solution, setSolution] = useState('');
  const [attachment, setAttachment] = useState(null);
	
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const fileInputRef = useRef(null); // Reference for the file input

   
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf", "application/zip"];
	const handleAttachmentSelection = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
			 
        setAttachment(file);
		}
		else{ 
		setAttachment(null);
		} 
  },[]);


	//validation
	const validation = useCallback(()=>{
		
			 // Check if solution is provided
		if (!solution.trim()) {
			setsubmitionMSG("Please provide a solution.");
			setShowModel(true);
			return false;
		}

		// If attachment exists, validate it
		if (attachment != null) {
			const fileType = attachment.type;
			 
			// Check file type
			if (!allowedTypes.includes(fileType)) {
				setsubmitionMSG("Invalid file type. Allowed types are JPG, PNG, PDF, ZIP.");
				setShowModel(true);
				return false;
			}

			 
		}

		return true;
	}, [solution, attachment]);
		 

  const handleSolutionSubmit = useCallback(async(e) => {
    e.preventDefault();
		// Run validation
    if (!validation()) {
      return;
    }

		setSubmitting(true); 
		 try
		 {
			   
				const formData = {
					problem_id: problem_id,
					solution: solution,
					attachment: attachment  
				}
				 
				let url = `/add-problem-solution`;
				 
				let contentType = 'multipart/form-data';
				 
				//call the function fetch post data fron server
				let data = await serverConnection(url,formData, authToken, contentType);
				 //console.log(data);
				if(data.status == true)
				{ 
					//set msg and promp true to visible
					setsubmitionMSG('Solution is submitted successfully.');
					setShowModel(true); 
					//empty form field
					setSolution('');
					setAttachment(null);
					
					// Clear file input field
					if (fileInputRef.current) {
						fileInputRef.current.value = ""; // Clear file input
					}
					
					// add new solution to solution list state
					setProblemSolutionList((pre)=>[data.newProblemSolution, ...pre]);
					
					//update solution count in  detail local state 
					updateProblemSolutionCount(data.solutionCount);
					
					//update redux problem States
					dispatch(updateProblemState({type : 'updateSolutionCount', solutionCount: data.solutionCount}));
					dispatch(updateUserProblemState({type : 'updateSolutionCount', solutionCount: data.solutionCount}));
				}
				else
				{
					setsubmitionMSG('Oops! Something went wrong.');
					setShowModel(true); 
				}
			  setSubmitting(false);
				
		 }
		 catch(error)
		 {
				//console.log(error);
				setsubmitionMSG('Oops! Something went wrong.');
				setShowModel(true); 
				setSubmitting(false);
		 }
 
  }, [ problem_id, authToken, solution, attachment]);


	// handle add solution for problem
	const handleSolutionChange = (val) => { 
        setSolution(val);
    };

  return (
    <div className="px-2  px-md-3 px-lg-4 py-5 review_form_container "  > 
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
			<h3 >Solution</h3>
      <Form onSubmit={handleSolutionSubmit}>
         

        {/* Review Text */}
        <Form.Group controlId="solution" className="mb-3">
          <Form.Label>Share Your Solution</Form.Label>
          
					 <TextEditor
							value={solution}
							onChange={handleSolutionChange}
							className="custom-text-box dark-custom-text-box"
							placeholder="Share your solution..."
						/>
													 
												 
        </Form.Group>
				<Form.Group className="mb-3" controlId="solutionAttachment">
						<Form.Label>Provide Additional Materials [<small className="text-warning">optional</small>]</Form.Label>
						<Form.Control
								type="file"
								ref={fileInputRef}
								className="bg-transparent  reviewformInput"
								name="attachment" // Single file input for attachment
								accept="image/jpg,image/jpeg, image/png, application/pdf, application/zip" onChange={handleAttachmentSelection}
						/>
						 
				</Form.Group>
        {/* Submit Button */}
        <Button variant="light" type="submit"   title="Submit Your solution" id="submitSolutionBTN" disabled={submitting}>
          {submitting ? 'Submitting':'Submit Solution'}
        </Button>
      </Form>
    </div>
  );
};

export default memo(AddProblemSolution);

