import {useCallback} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'; 
import Button from 'react-bootstrap/Button'; 
import {  BsSearch } from 'react-icons/bs';

const SearchBar = ({setSearchInput, searchBarPlaceholder}) => {
   
 const getSearchInput = useCallback((event)=>{
	event.preventDefault();
	setSearchInput(event.target.getSearchInput.value.trim());
 }, [setSearchInput]);
	
  return (
    <div className="px-2 py-3">
       <Form onSubmit={getSearchInput}>
				<Form.Group   controlId="formEmail"> 
						<InputGroup className="border-0  ">
							<Form.Control type="search"   className=" shadow-none bg-light rounded formInput"  name="getSearchInput" autoComplete="true"  />
							<Button variant="*" type="submit" title="Search Chat" id="searchChatBTN" className="rounded ms-1 purpleBTN_outline" >
								<BsSearch className="fs-4 fw-bold"/> 
							</Button>
							
						</InputGroup>
					</Form.Group>
				 
			</Form>
    </div>
  );
};

export default SearchBar;
