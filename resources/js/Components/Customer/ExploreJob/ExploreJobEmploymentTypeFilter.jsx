import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { updateExploreJobFilterState } from '../../../StoreWrapper/Slice/ExploreJobFilterSlice';
import { updateJobState } from '../../../StoreWrapper/Slice/JobSlice';
const ExploreJobEmploymentTypeFilter = () => {
  const dispatch = useDispatch();

  // Get the employment_type from the Redux store
  const employmentType = useSelector((state) => state.exploreJobFilters.filters?.employment_type || 'Employment Type');

  // Handle selecting an employment type
  const handleSelect = (type) => {
		
    dispatch(
      updateExploreJobFilterState({
        type: 'SetFilters',
        filter: { employment_type: type },
      })
    );
		dispatch(updateJobState({ type: 'refresh' }));
  };

  // Handle clearing the employment type filter
  const handleClearFilter = () => { 
    dispatch(
      updateExploreJobFilterState({
        type: 'SetFilters',
        filter: { employment_type: '' },
      })
    );
		dispatch(updateJobState({ type: 'refresh' }));
  };

  const employmentTypes = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    internship: 'Internship',
    contract: 'Contract',
  };

  return (
    <div className="flex-grow-1">
      <Dropdown className="exploreFilterDropDown">
        <Dropdown.Toggle
          variant="light"
          id="employment-type-dropdown-toggle"
          title="Select Employment Type"
          className={`w-100 h-100 py-3 px-2 border-0 rounded-0 exploreFilterSelectButton ${
            employmentType !== 'Employment Type' && employmentType !== '' ? 'selected' : ''
          }`}
        >
           {employmentTypes[employmentType] || 'Employment Type'}
        </Dropdown.Toggle>

        <Dropdown.Menu className="p-2 border-0 shadow dropdown_menu">
          {Object.entries(employmentTypes).map(([key, label]) => (
            <Dropdown.Item
              key={key}
              id={`employment-type-${key}`}
              title={`Select ${label} employment type`}
              onClick={() => handleSelect(key)} // Set the key in the filter
              className="py-2 rounded-1 text-center navigation_link"
            >
              {label} {/* Display label */}
            </Dropdown.Item>
          ))}

          {/* Divider for separating "Clear Filter" */}
          <Dropdown.Divider />

          {/* Clear Filter Option */}
          <Dropdown.Item
            id="clear-filter-item"
            title="Clear the Employment Type filter"
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

export default ExploreJobEmploymentTypeFilter;
