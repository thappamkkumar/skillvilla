 
import {memo, useEffect, useState, useRef, useCallback  } from 'react';
import {useSelector, useDispatch } from 'react-redux';   
import Button from 'react-bootstrap/Button';   
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';   
import Form from 'react-bootstrap/Form'; 
import InputGroup from 'react-bootstrap/InputGroup'; 

import {BsSearch,      BsArrowLeft  } from 'react-icons/bs'; 

import User from '../../UserCard/User'
import LoadMoreButton from '../../../Common/LoadMoreButton';
   
import { updateShareStatsState } from '../../../../StoreWrapper/Slice/ShareStatsSlice';
 
import serverConnection from '../../../../CustomHook/serverConnection';

const UserList = ({selectedUsers, setSelectedUsers}) => { 

	const authToken = useSelector((state) => state.auth.token); //selecting token from 
	const userList = useSelector((state) => state.shareStats.userList);  
	const userCursor = useSelector((state) => state.shareStats.userCursor);  
	const userHasMore = useSelector((state) => state.shareStats.userHasMore); 

		
	const [searchError, setSearchError] = useState(false);
	const dispatch = useDispatch();
	const [searchInput, setSearchInput] = useState('');
	const [searching, setSearching] = useState(false);
	const [loading, setLoading] = useState(false);
	 
	const firstRendering = useRef(true);
	 
	//function for fetching data
	const apiCall = useCallback(async(cursorNull = false, cancelSearch = false)=>{ 
		if(authToken == null) return;
		try
		{
			 
			setLoading(true);
			let customCursor = userCursor;
			//when first time api call cursor set. and when searching have to set cursor null first and then searching, updating cursor state ceate issue becasue state updated parallely so that when searhing using null for cursor
			if(cursorNull == true)
			{ 
				customCursor = null;
			}
		
		
			//call the function fetch   data fron server
			 
			const url = `/upload-new-post/get-user-list?cursor=${customCursor}`;
			
			const requestData = { };
			if(searchInput.trim() != '' && cancelSearch == false)
			{ 
				requestData.searchInput = searchInput;
			}
			//call the function fetch   data from server
			let result = await serverConnection(url, requestData, authToken);
			
			 
		//	console.log(result);
			 
			
			if(result != null && result.userList != null )
			{
				if(result.userList.data.length == 0 )
				{ 
					setSearchError(true); 
				}
				else
				{ 
					setSearchError(false); 
				}
				
				dispatch(updateShareStatsState({
					type : 'SetUserList', 
					userList: result.userList.data,
					append: customCursor != null, 
				}));  
				
				dispatch(updateShareStatsState({type : 'SetUserCursor', userCursor: result.userList.next_cursor})); 
				dispatch(updateShareStatsState({type : 'SetUserHasMore', userHasMore: result.userList.next_cursor != null})); 
			}
			
		}
		catch(error)
		{
			 //console.log(error);
			 
		}
		finally
		{
			 setLoading(false);
		}
			
	},[authToken, dispatch, userCursor, searchInput]); 

	useEffect(() => { 
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if( firstRendering.current)
		{ 
			apiCall();  
			firstRendering.current = false;
		} 
		
		return () => {
				// Cancel the request when the component unmounts 
				source.cancel('Request canceled due to component unmount '); 
		};
	}, [authToken ]);
	
	
	
	//function use to remove user from selected user list
	const removeSelectedUser = useCallback((id)=>{
		const updatedUsers = selectedUsers.filter(user => user.id !== id);
    setSelectedUsers(updatedUsers);
		
	}, [selectedUsers]);
	
	// Check if a user is selected
  const isUserSelected= useCallback((id) => {
    return selectedUsers.some(selected => selected.id === id);
  }, [selectedUsers]);
	
	
	
	
	//function use to handle selecting user and push into tagged user List 
	const selectUser = useCallback((id)=>{
	 
		const idExists = isUserSelected(id);
	   
	 if (!idExists) 
		{ 
			setSelectedUsers((prevItems)=>[{ id: id}, ...prevItems]);	
		} 
		else
		{
			removeSelectedUser(id);
		}
	}, [selectedUsers, isUserSelected, removeSelectedUser]);
	


	//function use to cancel searhing
	const cancelSearch = useCallback(()=>{
	  dispatch(updateShareStatsState({
					type : 'SetUserList', 
					userList: [],
					append: false, 
				})); 
		setSearchInput('');
		setSearching(false);
		apiCall(true, true);
			 
	}, [ setSearching, setSearchInput,  apiCall]);
	
	//function use to call function apiCall() to fetch data 
	const searchUser = useCallback(()=>{
	 
			if(searchInput.trim() != '')
			{ 
				dispatch(updateShareStatsState({
					type : 'SetUserList', 
					userList: [],
					append: false, 
				})); 
				setSearching(true);
				apiCall(true);
					 
			}
		 
		 
	}, [searchInput,setSearching, apiCall]);
	
	
	return ( 
		 
       
			<div className="pt-2">
			
				<div className="px-2 ">
					<Form.Group className="py-2 " controlId="shareUserId"> 
						<InputGroup className="gap-2">
							{ searching && 
								<Button variant="light" className="py-0 px-2  border-0 rounded " onClick={cancelSearch} id="backButton" title="Go to previous page"><BsArrowLeft className="  fw-bold fs-3" /></Button>
							}
							<Form.Control 
							type="text" 
							value={searchInput}
							onChange={(e)=>{setSearchInput(e.target.value)}}
							placeholder="Find user by name or ID.."  
							className="shadow-none bg-light  rounded formInput"
							name="searchInput"  autoComplete="off"  
							
							/> 
							<Button variant="dark" id="userSearchBTNId" title="Search user" className=" rounded   " onClick={searchUser}> <BsSearch className=" fs-4" /></Button>
						</InputGroup>
						
					</Form.Group>
					
					{searchError && !loading &&
						<div className=" pt-3 text-center">
							<h4>We couldn't find any user for your search.</h4>
							<p className="text-muted">
								Try searching for something else!
							</p>
						</div>
					}
					
				</div>
					
				<Row className="w-100 mx-auto    p-0   ">
					{userList != null && userList.map((user) => (
						<Col xs={6} sm={4} md={3} lg={3} key={user.id} className="  m-0 p-2">
							
							<div 
								className={` rounded-2    post user_card p-2 ${isUserSelected(user.id) ? 'postupload_selected_taggeduser  ' : ''}`}
								onClick={()=>{selectUser(user.id)}}>
									
									<User user={user} /> 
								
								</div>
								
						</Col>
					
					))}
				</Row>
					 	 
						
				{userHasMore && !loading && (
					<LoadMoreButton apiCall={apiCall}  loading={loading} />
				)}
				 
				{loading && <div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>}	
				
      </div>			
		 
	);
	
};

export default memo(UserList);
