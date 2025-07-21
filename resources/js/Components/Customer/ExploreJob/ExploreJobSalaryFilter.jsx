import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { updateExploreJobFilterState } from '../../../StoreWrapper/Slice/ExploreJobFilterSlice';
import { updateJobState } from '../../../StoreWrapper/Slice/JobSlice';

const ExploreJobSalaryFilter = () => {
  const dispatch = useDispatch();

  // Get the salary range from the Redux store
  const { min_salary, max_salary } = useSelector((state) => state.exploreJobFilters.filters || {});

  // Update selectedRange logic to show 'Select Salary' when min and max salary are both 0
  const selectedRange = 
    (min_salary === 0 && max_salary === 0) || min_salary === undefined || max_salary === undefined
    ? 'Select Salary'
    : `$${min_salary} - $${max_salary}`;

  // Salary range options
  const salaryRanges = [
    { min: 0, max: 100 },
    { min: 100, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 5000 },
    { min: 5000, max: 10000 },
    { min: 10000, max: 50000 },
    { min: 50000, max: 100000 },
    { min: 100000, max: 1000000 },
  ];

  // Handle selecting a salary range
  const handleSelect = (range) => {

    dispatch(
      updateExploreJobFilterState({
        type: 'SetFilters',
        filter: { min_salary: range.min, max_salary: range.max },
      })
    );
		    dispatch(updateJobState({ type: 'refresh' }));

  };

  // Handle clearing the salary filter
  const handleClearFilter = () => { 
    dispatch(
      updateExploreJobFilterState({
        type: 'SetFilters',
        filter: { min_salary: 0, max_salary: 0 },
      })
    );
		    dispatch(updateJobState({ type: 'refresh' }));

  };

  return (
    <div className="flex-grow-1">
      <Dropdown className="exploreFilterDropDown">
        <Dropdown.Toggle
          variant="light"
          id="salary-dropdown-toggle"
          title="Select Salary Range"
          className={`w-100 h-100 py-3 px-2 border-0 rounded-0 exploreFilterSelectButton ${
            selectedRange !== 'Select Salary' ? 'selected' : ''
          }`}
        >
          {selectedRange}
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="p-2 border-0 shadow dropdown_menu"
          style={{
            maxHeight: '50vh', // Set max-height to 50% of the viewport height
            overflowY: 'auto', // Enable vertical scrolling if content overflows
          }}
        >
          {salaryRanges.map((range) => (
            <Dropdown.Item
              key={`${range.min}-${range.max}`}
              onClick={() => handleSelect(range)}
              className="py-2 rounded-1 text-center navigation_link"
            >
              ${range.min} - ${range.max}
            </Dropdown.Item>
          ))}

          <Dropdown.Divider />

          <Dropdown.Item
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

export default ExploreJobSalaryFilter;
