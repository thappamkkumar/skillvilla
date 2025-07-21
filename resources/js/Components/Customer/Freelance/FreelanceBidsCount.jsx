import {useCallback, memo} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import   Button   from 'react-bootstrap/Button'; 
import {updateFreelanceBidState} from '../../../StoreWrapper/Slice/FreelanceBidSlice';
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';


const FreelanceBidsCount = ({freelance_id, totalBids, }) => {
	const navigate = useNavigate(); // Reference for navigation
	const dispatch = useDispatch(); // Reference for dispatch
  
	// Navigate to freelance bids
  const handleNavigateFreelanceBids = useCallback(() => {
		dispatch(updateFreelanceBidState({ type: 'refresh' }));
    //manageVisitedUrl(`/freelance-bids/${freelance_id}`, 'append');
    navigate(`/freelance-bids/${freelance_id}`);
  }, [freelance_id, navigate]);
	
	
 
  return (
    <>
		<Button 
			variant="dark"
			className="  d-flex flex-wrap gap-2 align-items-center justify-content-center"
			title="Total Bids"
			id="goToBidsList"
			onClick={handleNavigateFreelanceBids}
			>
			<strong className=" px-2 rounded   bg-light text-dark  ">{totalBids ?? 0}  </strong>
			<span className=" "> Bids</span>
		</Button>
		 
			 
		 
		
		</>
  );
};

export default memo(FreelanceBidsCount);
