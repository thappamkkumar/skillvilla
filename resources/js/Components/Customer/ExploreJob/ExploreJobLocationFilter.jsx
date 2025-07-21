import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { updateExploreJobFilterState } from '../../../StoreWrapper/Slice/ExploreJobFilterSlice';
import { updateJobState } from '../../../StoreWrapper/Slice/JobSlice';
const ExploreJobLocationFilter = () => {
  const dispatch = useDispatch();
	const locations = useSelector((state) => state.exploreJobFilters.jobLocations); 
	
  // Get the job_location filter value from the Redux store
  const selectedLocation = useSelector(
    (state) => state.exploreJobFilters.filters?.job_location || 'Select Location'
  );

  // Handle selecting a location
  const handleSelect = (location) => {
		 
    dispatch(
      updateExploreJobFilterState({
        type: 'SetFilters',
        filter: { job_location: location },
      })
    );
		dispatch(updateJobState({ type: 'refresh' }));
		
  };

  // Handle clearing the location filter
  const handleClearFilter = () => {
		
    dispatch(
      updateExploreJobFilterState({
        type: 'SetFilters',
        filter: { job_location: '' },
      })
    );
		
		dispatch(updateJobState({ type: 'refresh' }));
  };

   
  return (
    <div className="flex-grow-1">
      <Dropdown className="exploreFilterDropDown">
        <Dropdown.Toggle
          variant="light"
          id="location-dropdown-toggle"
          title="Select Location"
          className={`w-100 h-100 py-3 px-2 border-0 rounded-0 exploreFilterSelectButton ${
            selectedLocation !== 'Select Location' && selectedLocation !== '' ? 'selected' : ''
          }`}
        >
          {selectedLocation}
        </Dropdown.Toggle>

        <Dropdown.Menu 
				className="p-2 border-0 shadow  "
				style={{
            maxHeight: '50vh',   // Set max-height to 70% of the viewport height
            overflowY: 'auto',   // Enable vertical scrolling if content overflows
          }}
				
				>
          {locations.map((location) => (
            <Dropdown.Item
              key={location}
              id={`location-${location.toLowerCase()}`}
              title={`Select ${location}`}
              onClick={() => handleSelect(location)}
              className="py-2 rounded-1 text-center navigation_link"
            >
              {location}
            </Dropdown.Item>
          ))}

          {/* Divider for separating "Clear Filter" */}
          <Dropdown.Divider />

          {/* Clear Filter Option */}
          <Dropdown.Item
            id="clear-location-filter-item"
            title="Clear the Location filter"
            onClick={handleClearFilter}
            className="py-2 rounded-1 text-center exploreFilterClearBTN"
          >
            Clear Filter
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ExploreJobLocationFilter;
