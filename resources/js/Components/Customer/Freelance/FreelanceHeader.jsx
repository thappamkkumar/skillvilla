 
import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { BsThreeDotsVertical, BsTrash3, BsCardText,BsPersonLinesFill, BsPencil, BsShare } from "react-icons/bs";

import { updateFreelanceState } from '../../../StoreWrapper/Slice/MyFreelanceSlice';
import {updateFreelanceBidState} from '../../../StoreWrapper/Slice/FreelanceBidSlice';
import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';
 
 
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';

const FreelanceHeader = ({ 
	title,
	user_id,
	freelance_id,
	chatBox,
	detail = false,
	setFreelanceDetail = () => {}

 }) => {
  
	
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user)); // Login info
  const authToken = useSelector((state) => state.auth.token); // Token from store
  const [submissionMSG, setSubmissionMSG] = useState(null); // Submission message state
  const [showModel, setShowModel] = useState(false); // Alert message state
  const [deleted, setDeleted] = useState(false); // Job deletion state
	const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch(); // Reference for dispatch
  const navigate = useNavigate(); // Reference for navigation

  // Navigate to freelance detail
  const handleNavigateFreelanceDetail = useCallback(() => {
    if (!detail) {
     // manageVisitedUrl(`/freelance-detail/${freelance_id}`, 'append');
      navigate(`/freelance-detail/${freelance_id}`);
    }
  }, [detail, freelance_id, navigate]);

  // Navigate to freelance update
  const handleUpdateFreelance = useCallback(() => {
     
      //manageVisitedUrl(`/freelance-update/${freelance_id}`, 'append');
      navigate(`/freelance-update/${freelance_id}`);
    
  }, [  freelance_id, navigate]);

  

  // Navigate to freelance bids
  const handleNavigateFreelanceBid = useCallback(() => {
		dispatch(updateFreelanceBidState({ type: 'refresh' }));
   // manageVisitedUrl(`/freelance-bids/${freelance_id}`, 'append');
    navigate(`/freelance-bids/${freelance_id}`);
  }, [freelance_id, navigate]);


	//function use to handle freelance share
	const handleFreelanceShare = useCallback(() =>
	{ 
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: freelance_id}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: "freelance"})); 
	}, [freelance_id]);
	
	

  // Handle  freelance  deletion
  const handleDeleteFreelance = useCallback(async () => {
		setShowConfirm(false);
    if (!freelance_id) return;

    const data = await serverConnection(`/delete-freelance-work`, { freelance_id }, authToken);

    if (data.status) {
      setSubmissionMSG('Freelance work is deleted successfully.');
      setShowModel(true);
      setDeleted(true);
    } else {
      setSubmissionMSG('Failed to delete the freelance work. Please try again.');
      setShowModel(true);
    }
  }, [authToken, freelance_id]);

  // Close modal
  const handleModalClose = useCallback(() => {
    setShowModel(false);

    if (deleted) {
      dispatch(updateFreelanceState({ type: 'deleteFreelance', freelance_id:freelance_id }));
     
      setFreelanceDetail(null);
    }
  }, [dispatch, deleted, freelance_id, setFreelanceDetail]);

  return (
    <>
			<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteFreelance}
        message="Are you sure you want to delete this freelance work."
        confirmLabel="Delete"
				/>
      <MessageAlert setShowModel={handleModalClose} showModel={showModel} message={submissionMSG} />
      <div className="w-100  h-auto d-flex justify-content-between align-items-start RelativeContainer">
        <div
          className={`${!detail && 'btn p-0 m-0 border-0 text-start'}`}
          onClick={handleNavigateFreelanceDetail}
        >
          {detail ? (
            <h4 className="fw-semibold p-0 text-break">{title}</h4>
          ) : (
            <h5 className="fw-semibold p-0 text-break">{title}</h5>
          )}
        </div>
        <div className="ps-3">
          <Dropdown>
             <Dropdown.Toggle
                variant="*"
                id={`jobDropDownMenu${freelance_id}`}
                title="More"
                className="border-0 p-1 custom_dropdown_toggle_post_header"
              >
                <BsThreeDotsVertical />
              </Dropdown.Toggle>
             
            <Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{ overflow: 'hidden' }}>
              {!detail && (
                <Dropdown.Item
                  as="button"
                  id={`navigateToFreelanceDetail${freelance_id}`}
                  title={`Freelance "${title}" detail`}
                  className="py-2  d-flex align-items-center gap-2  rounded  navigation_link"
                  onClick={handleNavigateFreelanceDetail}
                >
                  <BsCardText />
                  <span className="px-2">Detail</span>
                </Dropdown.Item>
              )}
							
							{
								!chatBox &&
								<>
									<Dropdown.Item as="button" variant="*" id={`shareFreelance${freelance_id}`} title={`Share freelance ${freelance_id}`}  className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={handleFreelanceShare}>
											<BsShare   /> <span className="px-2">Share </span>	  
									</Dropdown.Item>
									 
									
									{loggedUserData.id === user_id && (
										<>
										
										 <Dropdown.Item
												as="button"
												id={`bidsOnFreelanceButton${freelance_id}`}
												title={`Bids onfreelance "${title}"`}
												className="py-2  d-flex align-items-center gap-2  rounded navigation_link"
												onClick={handleNavigateFreelanceBid}
											>
												<BsPersonLinesFill />
												<span className="px-2">Bids</span>
											</Dropdown.Item>  
											
											<Dropdown.Item
												as="button"
												id={`updateFreelanceButton${freelance_id}`}
												title={`Update Freelance "${title}"`}
												className="py-2  d-flex align-items-center gap-2  rounded navigation_link"
												onClick={handleUpdateFreelance}
											>
												<BsPencil />
												<span className="px-2">Update</span>
											</Dropdown.Item>
											
											 {/* Divider for separating "Clear Filter" */}
											<Dropdown.Divider />
											
											<Dropdown.Item
												as="button" 
												id={`deleteFreelanceButton${freelance_id}`}
												title={`Delete Freelance "${title}"`}
												className="py-2  d-flex align-items-center gap-2  rounded  	exploreFilterClearBTN     "
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


export default memo(FreelanceHeader);
