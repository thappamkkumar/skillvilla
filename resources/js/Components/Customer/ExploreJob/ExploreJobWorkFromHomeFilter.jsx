import { useEffect } from 'react'; 
import { useSelector,useDispatch } from "react-redux";
 import { updateJobState } from '../../../StoreWrapper/Slice/JobSlice';
import {updateExploreJobFilterState} from '../../../StoreWrapper/Slice/ExploreJobFilterSlice';

const ExploreJobWorkFromHomeFilter = ( ) => {
	const jobFilter = useSelector((state) => state.exploreJobFilters.filters); //selecting filter from store
	const dispatch = useDispatch();

  // Function to handle button click and toggle the state
	const handleButtonClick = () => {
		// Toggle the work_from_home state
		const newCheckedState = jobFilter.work_from_home === true ? false : true;
		// Update the global state using the setJobFilter function
		dispatch(updateExploreJobFilterState({type : 'SetFilters', filter: {work_from_home: newCheckedState}}));
 
		dispatch(updateJobState({ type: 'refresh' }));
		
	};


  

  // Determine the button's class based on the work_from_home value
  const getButtonClass = () => {
    if (jobFilter.work_from_home === true) {
      return 'exploreFilterWorkFromHome-selected'; // Button for true
    }
    if (jobFilter.work_from_home === false || jobFilter.work_from_home == null) {
      return 'exploreFilterWorkFromHome'; // Button for false
    }
    return 'exploreFilterWorkFromHome'; // Neutral state for null
  };

  return (
    <div className="  flex-grow-1  ">
      {/* Button for toggling the work-from-home state */}
      <button 
        variant="light" 
        id="exploreFilterWorkFromHome"
        title="Work from home"
        className={`py-3 px-2 w-100  border-0   ${getButtonClass()}`} 
        onClick={handleButtonClick}
      >
        Remote
      </button>
    </div>
  );
};

export default ExploreJobWorkFromHomeFilter;
