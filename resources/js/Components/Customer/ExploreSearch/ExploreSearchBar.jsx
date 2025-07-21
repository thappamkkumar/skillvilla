import { useState, useRef, useCallback, useEffect , memo} from "react";
import SlidingText from './SlidingTExt/SlidingText';
import { useSelector, useDispatch } from "react-redux";
import { BsX } from "react-icons/bs";

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'; 
import Button from 'react-bootstrap/Button'; 
import { updateExploreSearchState } from '../../../StoreWrapper/Slice/ExploreSearchSlice';
import {updateJobState} from '../../../StoreWrapper/Slice/JobSlice';
import {updateFreelanceState} from '../../../StoreWrapper/Slice/FreelanceSlice';
import {updateExploreJobFilterState} from '../../../StoreWrapper/Slice/ExploreJobFilterSlice';
import { updatePostState } from '../../../StoreWrapper/Slice/PostSlice';  
import {updateWorkfolioState} from '../../../StoreWrapper/Slice/WorkfolioSlice';
import {updateProblemState} from '../../../StoreWrapper/Slice/ProblemSlice'; 
import {updateUserState} from '../../../StoreWrapper/Slice/UserSlice'; 
import {updateCommunityState} from '../../../StoreWrapper/Slice/SuggestionCommunitySlice';

const ExploreSearchBar = () => { 
  const searchInput = useSelector((state) => state.exploreSearch.searchInput); // Selecting searchInput from store
  const searching = useSelector((state) => state.exploreSearch.searching); // Selecting searchInput from store
  const [searchInputOpen, setSearchInputOpen] = useState(searchInput == '' ? false : true);
  const [localSearchInput, setLocalSearchInput] = useState(searchInput); // Local state for search input
  const inputRef = useRef(null); // Create a ref for the input field
  const dispatch = useDispatch();
  
	
	
	
 const toggleSearchInput = useCallback(() => {
    setSearchInputOpen((pre) => !pre);
  }, []);



  const handleOnBlur = useCallback((e) => {
    const val = e.target.value;
		 
    if (!val) {
      toggleSearchInput(); 
    }
		if (val && val.trim()=='') {
      toggleSearchInput();
			 setLocalSearchInput('');
    }
  }, [toggleSearchInput, setLocalSearchInput]);



  useEffect(() => {
    if (searchInputOpen && inputRef.current) {
      inputRef.current.focus(); // Focus the input when it's shown
    }
  }, [searchInputOpen]);

 


  // Update Redux state when the button is clicked for set search value
  const setSearch = useCallback(() => {
		let trimedInput = localSearchInput.trim();
		if(localSearchInput.trim() != '')
		{
			dispatch(updateExploreSearchState({ type: 'SetSearchInput', searchInput: localSearchInput.trim() }));
			dispatch(updateUserState({ type: 'refresh' }));
			dispatch(updatePostState({ type: 'refresh' }));
			dispatch(updateWorkfolioState({ type: 'refresh' }));
			dispatch(updateProblemState({ type: 'refresh' }));
			dispatch(updateJobState({ type: 'refresh' }));
			dispatch(updateFreelanceState({ type: 'refresh' }));
			dispatch(updateCommunityState({ type: 'refresh' }));
			dispatch(updateExploreJobFilterState({ type: 'refresh' }));
				
			
		}
  }, [dispatch, localSearchInput]);
	
	
// Update Redux state when the button is clicked for remove search value
  const removeSearch = useCallback(() => { 
		setLocalSearchInput('');
		toggleSearchInput();
		if(searching  )
		{
			dispatch(updateExploreSearchState({ type: 'refresh'  }));
			
			dispatch(updateUserState({ type: 'refresh' }));
			dispatch(updatePostState({ type: 'refresh' }));
			dispatch(updateWorkfolioState({ type: 'refresh' }));
			dispatch(updateProblemState({ type: 'refresh' }));
			dispatch(updateJobState({ type: 'refresh' }));
			dispatch(updateFreelanceState({ type: 'refresh' }));
			dispatch(updateCommunityState({ type: 'refresh' }));
			dispatch(updateExploreJobFilterState({ type: 'refresh' }));
			
			
		}
  }, [dispatch,searching, setLocalSearchInput,toggleSearchInput]);


// Handle form submission
	const onSearchSubmit = useCallback(async(e) => {
		  e.preventDefault();
			setSearch();
	},[setSearch]);

  return ( 
    <div className="exploreSearchBarContainer p-2">
      <Form noValidate onSubmit={onSearchSubmit}>
        <Form.Group controlId="searchInput">
          <InputGroup>
            {
              searchInputOpen ? (
                <Form.Control 
                  type="text" 
                  ref={inputRef}  
                  className="rounded-0 py-1 px-0 shadow-none border-0 searhFormInput"  
                  name="getSearchInput" 
                  autoComplete="off" 
                  onBlur={handleOnBlur}
                  value={localSearchInput}
                  onChange={(e) => setLocalSearchInput(e.target.value)} // Update local state on input change
                />
              ) : (
                <SlidingText toggleSearchInput={toggleSearchInput} />
              )
            }
						<div className="ms-1">
						{
							localSearchInput  != ''  &&
							(
							 
								<Button
									variant="outline-light"
									type="button" // Change to button to prevent form submission
									title="Remove Search" 
									id="removeSearchBTN" 
									className="rounded-1 px-1 py-0  fs-4 lh-1 border-0  "
									onClick={removeSearch} // Set search input to Redux state on click
								>
									<BsX style={{ strokeWidth: '1.2',  }}/>
								</Button> 
								
							 
							)
						}
						{
							localSearchInput.trim()  == ''  && searching &&
							(
							 
								<Button
									variant="outline-light"
									type="button" // Change to button to prevent form submission
									title="Remove Search" 
									id="removeSearchWhenNoInputBTN" 
									className="rounded-1 px-1 py-0  fs-4 lh-1 border-0  "
									onClick={removeSearch} // Set search input to Redux state on click
								>
									<BsX style={{ strokeWidth: '1.2',  }}/>
								</Button> 
								
							 
							)
						}
            <Button
              variant="light"
              type="button" // Change to button to prevent form submission
              title="Search" 
              id="searchBTN" 
              className="rounded-1  lh-1 fw-bold ms-1  "
              onClick={setSearch} // Set search input to Redux state on click
            >
              Search
            </Button>
						</div>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
};

export default memo(ExploreSearchBar);
