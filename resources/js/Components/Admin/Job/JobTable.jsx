import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { BsThreeDotsVertical, BsTrash3, BsCardText } from "react-icons/bs";

import ConfirmDialog from "../../ConfirmDialog";
import MessageAlert from "../../MessageAlert";
import serverConnection from "../../../CustomHook/serverConnection";
//import manageVisitedUrl from "../../../CustomHook/manageVisitedUrl";
import { updateListState } from "../../../StoreWrapper/Slice/Admin/AdminListSlice";

const JobTable = ({ jobs }) => {
  const authToken = useSelector((state) => state.auth.token);
  const [submitionMSG, setSubmitionMSG] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const moreAboutJob = useCallback((id) => {
   // manageVisitedUrl(`/admin/job-detail/${id}`, "append");
    navigate(`/admin/job-detail/${id}`);
  }, []);
 
 //navigate to user profile
	const moreAboutUser= useCallback((id, userId)=>{
	//	manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);

  const handleDeleteJob = useCallback(async () => {
    setShowConfirm(false);
    if (deleteJobId == null || authToken == null) {
      return;
    }
    try {
      let data = await serverConnection("/delete-job-vacancy", { job_id: deleteJobId }, authToken);
      if (data.status) 
			{
        dispatch(updateListState({ type: "ItemDelete", deleted_id: deleteJobId }));
        setSubmitionMSG("Job is deleted successfully.");
      } else 
			{
        setSubmitionMSG("Failed to delete the job. Please try again.");
			}
    } 
		catch (error) 
		{
      setSubmitionMSG("An error occurred. Please try again.");
    } 
		finally 
		{
      setDeleteJobId(null);
      setShowModel(true);
    }
  }, [authToken, deleteJobId]);

  return (
    <div className="mt-4 mb-4 sub_main_container p-2 overflow-auto" style={{ minHeight: "40vh" }}>
      <Table bordered variant="white" className="m-0 text-center">
        <thead className="table-secondary">
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Posted By</th>
            <th>Salary</th>
            <th>Expires</th>
            <th>Applications</th>
            <th>Posted</th>
            <th>More</th>
          </tr>
        </thead>
        <tbody>
          {jobs && jobs.length > 0 ? (
            jobs.map((job, index) => (
              <tr key={index}>
							
                <td>{index + 1}</td>
                <td>{job.title}</td>
								
								<td>
                  <Button
                    variant="light"
                    className="py-0"
										id={`userProfile${job.user.id}`}
										title={`User profile ${job.user.userID}`}
                    onClick={() => moreAboutUser(job.user.id, job.user.userID)}
                  >
                    {job.user.userID}
                  </Button>
                </td>
								
                <td>{job.salary}</td>
               
								<td className={job.is_expired ? "text-danger fw-bold" : ""}>
                  {job.is_expired ? "Expired" : job.expires_at}
                </td>
								
                <td>{job.applications_count}</td>
                <td>{job.created_at_formated}</td>
								
                <td>
									
									<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`jobAction${job.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
												<Dropdown.Item as="button" variant="*" id={`jobDetail${job.id}`} title={`Job detail "${job.id}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutJob(job.id)}>
													<BsCardText /> <span className="px-2">Detail </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deleteJob${job.id}`} title={`Delete job "${job.id}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeleteJobId(job.id); setShowConfirm(true); }
													
													}>
													<BsTrash3 /> <span className="px-2">Delete </span>	
												</Dropdown.Item>
													 
											</Dropdown.Menu>
										</Dropdown> 
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-4 fw-bold text-danger">
                No jobs found!
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG} />

      <ConfirmDialog
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteJob}
        message="Are you sure you want to delete this job?"
        confirmLabel="Delete"
      />
    </div>
  );
};

export default JobTable;