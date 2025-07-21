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

const FreelanceTable = ({ freelances }) => {
  const authToken = useSelector((state) => state.auth.token);
  const [submitionMSG, setSubmitionMSG] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteFreelanceId, setDeleteFreelanceId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const moreAboutFreelance = useCallback((id) => {
   // manageVisitedUrl(`/admin/freelance-detail/${id}`, "append");
    navigate(`/admin/freelance-detail/${id}`);
  }, []);
 
 //navigate to user profile
	const moreAboutUser= useCallback((id, userId)=>{
		//manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);

  const handleDeleteFreelance = useCallback(async () => {
    setShowConfirm(false);
    if (deleteFreelanceId == null || authToken == null) {
      return;
    }
    try {
      let data = await serverConnection("/delete-freelance-work", { freelance_id: deleteFreelanceId }, authToken);
      if (data.status) 
			{
        dispatch(updateListState({ type: "ItemDelete", deleted_id: deleteFreelanceId }));
        setSubmitionMSG("Freelance is deleted successfully.");
      } else 
			{
        setSubmitionMSG("Failed to delete the freelance. Please try again.");
			}
    } 
		catch (error) 
		{
      setSubmitionMSG("An error occurred. Please try again.");
    } 
		finally 
		{
      setDeleteFreelanceId(null);
      setShowModel(true);
    }
  }, [authToken, deleteFreelanceId]);

  return (
    <div className="mt-4 mb-4 sub_main_container p-2 overflow-auto" style={{ minHeight: "40vh" }}>
      <Table bordered variant="white" className="m-0 text-center">
        <thead className="table-secondary">
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Posted By</th>
            <th>Budget</th>
            <th>Deadline</th>
            <th>Total Bids</th>
            <th>Posted</th> 
            <th>More</th>
          </tr>
        </thead>
        <tbody>
          {freelances && freelances.length > 0 ? (
            freelances.map((freelance, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{freelance.title}</td> 
								<td>
                  <Button
                    variant="light"
                    className="py-0"
										id={`userProfile${freelance.user.id}`}
										title={`User profile ${freelance.user.userID}`}
                    onClick={() => moreAboutUser(freelance.user.id, freelance.user.userID)}
                  >
                    {freelance.user.userID}
                  </Button>
								</td>
								
								<td>
									${freelance.budget_min} - ${freelance.budget_max	} 
								</td> 

								<td className={` ${freelance.is_expired && 'text-danger'}`}>
									{freelance.deadline}
								</td>
								
                <td>{freelance.bids_count}</td>
                
                <td>{freelance.created_at_formated}</td>
                
                <td>
									
									<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`freelanceAction${freelance.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle>
									 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
												 
														 
												<Dropdown.Item as="button" variant="*" id={`freelanceDetail${freelance.id}`} title={`Freelance detail "${freelance.id}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>moreAboutFreelance(freelance.id)}>
													<BsCardText /> <span className="px-2">Detail </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deleteFreelance${freelance.id}`} title={`Delete freelance "${freelance.id}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeleteFreelanceId(freelance.id); setShowConfirm(true); }
													
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
                No freelance found!
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG} />

      <ConfirmDialog
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteFreelance}
        message="Are you sure you want to delete this freelance?"
        confirmLabel="Delete"
      />
    </div>
  );
};

export default FreelanceTable;