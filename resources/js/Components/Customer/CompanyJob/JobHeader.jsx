 
import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { BsThreeDotsVertical, BsTrash3, BsCardText,BsPersonLinesFill, BsPencil, BsShare  } from "react-icons/bs";

import { updateJobState } from '../../../StoreWrapper/Slice/MyJobSlice';
import {updateJobApplicationState} from '../../../StoreWrapper/Slice/JobApplicationSlice';
import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';

 
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';

const JobHeader = ({
	title,
	user_id,
	job_id,
	chatBox,
	detail = false,
	setJobDetail = () => {} 
	
	}) => {
 


 const loggedUserData = JSON.parse(useSelector((state) => state.auth.user)); // Login info
  const authToken = useSelector((state) => state.auth.token); // Token from store
  const [submissionMSG, setSubmissionMSG] = useState(null); // Submission message state
  const [showModel, setShowModel] = useState(false); // Alert message state
  const [deleted, setDeleted] = useState(false); // Job deletion state
	const [showConfirm, setShowConfirm] = useState(false); 
  const dispatch = useDispatch(); // Reference for dispatch
  const navigate = useNavigate(); // Reference for navigation

  // Navigate to job detail
  const handleNavigateJobDetail = useCallback(() => {
    if (!detail) {
    //  manageVisitedUrl(`/job-detail/${job_id}`, 'append');
      navigate(`/job-detail/${job_id}`);
    }
  }, [detail, job_id, navigate]);

  // Navigate to update job vacancy
  const handleNavigateUpdateJobVacancy = useCallback(() => {
     
     // manageVisitedUrl(`/job-update/${job_id}`, 'append');
      navigate(`/job-update/${job_id}`);
    
  }, [  job_id, navigate]);

  

  // Navigate to job applications
  const handleNavigateJobApplication = useCallback(() => {
		dispatch(updateJobApplicationState({ type: 'refresh' }));
   // manageVisitedUrl(`/job-applications/${job_id}`, 'append');
    navigate(`/job-applications/${job_id}`);
  }, [job_id, navigate]);
	
	
	//function use to handle job share
	const handleJobShare = useCallback(() =>
	{ 
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: job_id}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: "job"}));
		
	}, [job_id]);
	

  // Handle job deletion
  const handleDeleteJob = useCallback(async () => {
		setShowConfirm(false);
    if (!job_id) return;

    const data = await serverConnection(`/delete-job-vacancy`, { job_id }, authToken);

    if (data.status) {
      setSubmissionMSG('Job is deleted successfully.');
      setShowModel(true);
      setDeleted(true);
    } else {
      setSubmissionMSG('Failed to delete the job. Please try again.');
      setShowModel(true);
    }
  }, [authToken, job_id]);

  // Close modal
  const handleModalClose = useCallback(() => {
    setShowModel(false);

    if (deleted) {
      dispatch(updateJobState({ type: 'deleteJob', job_id:job_id }));
     // dispatch(updateUserJobState({ type: 'deleteJob', job_id }));
      setJobDetail(null);
    }
  }, [dispatch, deleted, job_id, setJobDetail]);

  return (
    <>
			<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteJob}
        message="Are you sure you want to delete this job vacancy."
        confirmLabel="Delete"
				/>
      <MessageAlert setShowModel={handleModalClose} showModel={showModel} message={submissionMSG} />
      <div className="w-100  h-auto d-flex justify-content-between align-items-start RelativeContainer">
        <div
          className={`${!detail && 'btn p-0 m-0 border-0 text-start'}`}
          onClick={handleNavigateJobDetail}
        >
          {
						detail ? (
							<h4 className="fw-semibold p-0 text-break">{title}</h4>
						) : (
							<h5 className="fw-semibold p-0 text-break">{title}</h5>
						)
					}
        </div>
        <div className="ps-3">
          <Dropdown className="">
               <Dropdown.Toggle
                variant="*"
                id={`jobDropDownMenu${job_id}`}
                title="More"
                className="border-0 p-1  custom_dropdown_toggle_post_header"
              >
                <BsThreeDotsVertical />
              </Dropdown.Toggle>
            
            <Dropdown.Menu className="p-2 border-0 shadow dropdown_menu " style={{ overflow: 'hidden' }}>
              {!detail && (
                <Dropdown.Item
                  as="button"
                  id={`navigateToJobDetail${job_id}`}
                  title={`Job "${title}" detail`}
                  className="py-2  d-flex align-items-center gap-2  rounded  navigation_link"
                  onClick={handleNavigateJobDetail}
                >
                  <BsCardText />
                  <span className="px-2">Detail</span>
                </Dropdown.Item>
              )}
							
							{
								!chatBox &&
								<>
									<Dropdown.Item as="button" variant="*" id={`shareJob${job_id}`} title={`Share job ${job_id}`}  className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={handleJobShare}>
											<BsShare   /> <span className="px-2">Share </span>	  
									</Dropdown.Item>
						 
							
									{loggedUserData.id === user_id && (
										<>
										
										 <Dropdown.Item
												as="button"
												id={`applicationOnJobButton${job_id}`}
												title={`Applications on Job "${title}"`}
												className="py-2  d-flex align-items-center gap-2  rounded navigation_link"
												onClick={handleNavigateJobApplication}
											>
												<BsPersonLinesFill />
												<span className="px-2">Applications</span>
											</Dropdown.Item>  
											
											<Dropdown.Item
												as="button"
												id={`updateJobButton${job_id}`}
												title={`Update Job "${title}"`}
												className="py-2  d-flex align-items-center gap-2  rounded navigation_link"
												onClick={handleNavigateUpdateJobVacancy}
											>
												<BsPencil />
												<span className="px-2">Update</span>
											</Dropdown.Item>
											
											
											
											{/* Divider for separating "Clear Filter" */}
											<Dropdown.Divider />
											
											<Dropdown.Item
												as="button"
												id={`deleteJobButton${job_id}`}
												title={`Delete Job "${title}"`}
												className="py-2  d-flex align-items-center gap-2  rounded exploreFilterClearBTN"
												onClick={() => setShowConfirm(true)}
											>
												<BsTrash3 />
												<span className="px-2">Delete</span>
											</Dropdown.Item>
											

										 
										</>
									)}
								</>
							}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  );
};


export default memo(JobHeader);
