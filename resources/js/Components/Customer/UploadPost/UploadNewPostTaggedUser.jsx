 
import {memo, useEffect, useState, useCallback, useRef} from 'react';
import {useSelector } from 'react-redux';  
import Form from 'react-bootstrap/Form'; 
import InputGroup from 'react-bootstrap/InputGroup'; 
import Button from 'react-bootstrap/Button'; 
import Image from 'react-bootstrap/Image'; 
import Offcanvas from 'react-bootstrap/Offcanvas';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';  

import {BsSearch, BsX, BsCheck2 , BsArrowLeft  } from 'react-icons/bs'; 
 
import User from '../UserCard/User'

 
import LoadMoreButton from '../../Common/LoadMoreButton';
import serverConnection from '../../../CustomHook/serverConnection';
import handleImageError from '../../../CustomHook/handleImageError';

const UploadNewPostTaggedUser = ({taggedUser, setTaggedUser  }) => { 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	
	const [searchError, setSearchError] = useState(false);
	const [cursor, setCursor] = useState(null);
	const [hasMore, setHasMore] = useState(false);
	const [userList, setUserList] = useState([]);
	const [showUserList, setShowUserList] = useState(false);
	const [loading, setLoading] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const [searching, setSearching] = useState(false);
	 
 
	//function for handle User list box show and hide
	const handleCloseUserList = useCallback(()=>{
		setCursor(null);
		setHasMore(false);
		setUserList([]);
		setShowUserList(false); 
		setSearching(false); 
		setSearchError(false);
		setSearchInput('');
	}, []); 
	
	//get list of users that user search
	const apiCall = useCallback(async(cursorNull = false, cancelSearch = false)=>{
		 
		try
		{
			setLoading(true);
			let customCursor = cursor;
			
			//when first time api call cursor set. and when searching have to set cursor null first and then searching, updating cursor state ceate issue becasue state updated parallely so that when searhing using null for cursor
			if(cursorNull == true)
			{ 
				customCursor = null;
			}
			const url = `/upload-new-post/get-user-list?cursor=${customCursor}`;
			
			const requestData = { };
			if(searchInput.trim() != '' && cancelSearch == false)
			{
				requestData.searchInput = searchInput;
			}
			//call the function fetch   data from server
			let result = await serverConnection(url, requestData, authToken);
			
			//console.log(result);
			if(result.userList.data.length <= 0)
			{ 
				setSearchError(true);
				setLoading(false);
				setCursor(null);
				setHasMore(false);
			
				return;
			}
			setSearchError(false);
			setCursor(result.userList.next_cursor);
			if(cursorNull == true || cancelSearch == true)
			{
				setUserList([ ...result.userList.data]); 
			
			}
			else
			{
				setUserList((prevItems)=>[ ...prevItems, ...result.userList.data]); 
			
			}
			
			setHasMore(result.userList.next_cursor != null);
			setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
	}, [authToken, cursor, searchInput]);
	
	
	
	//function use to open user list box and call function apiCall() to fetch data
	const openUserList = useCallback(()=>{
		apiCall();
		setShowUserList(true);
		
	}, [setShowUserList, apiCall]);
	
	//function use to call function apiCall() to fetch data 
	const searchUser = useCallback(()=>{
	 
			if(searchInput.trim() != '')
			{
				  setUserList([]);
					setSearching(true);
					apiCall(true);
					 
			}
		 
		 
	}, [searchInput,setSearching, setUserList,  apiCall]);
	
	 //function use to cancel searhing
	const cancelSearch = useCallback(()=>{
	 
			 	  setUserList([]);
					setSearchInput('');
					setSearching(false);
					apiCall(true, true);
					   
	}, [ setSearching, setSearchInput, setUserList, apiCall]);
	
	 
	
	//function use to remove user from tagged user list
	const removeTaggedUser = useCallback((id)=>{
		const updatedUsers = taggedUser.filter(user => user.id !== id);
    setTaggedUser(updatedUsers);
		
	}, [taggedUser]);
	
	// Check if a user is tagged
  const isUserTagged = useCallback((userId) => {
    return taggedUser.some(tagged => tagged.userId === userId);
  }, [taggedUser]);
	
	
	
	
	//function use to handle selecting user and push into tagged user List 
	const selectUser = useCallback((id, userId)=>{
	 
		const idExists = isUserTagged(userId);
	   
	 if (!idExists) 
		{ 
			setTaggedUser((prevItems)=>[{ id: id, userId: userId }, ...prevItems]);	
		} 
		else
		{
			removeTaggedUser(id);
		}
	}, [taggedUser, isUserTagged, removeTaggedUser]);
	
	
	
	return ( 
		<div className=" pt-3">  
			<h6>Tag Users</h6>
			{
				taggedUser.length > 0 && 
				<div className="d-inline-flex gap-2 flex-wrap tech_skill_container pb-2">
					{ taggedUser.map((user)=>(
							 
							<div key={user.id} className=" d-flex gap-3 align-items-center  p-1 px-2   rounded tech_skill">
								
								<span  >{user.userId}</span>
								 
								<Button variant="danger" title={`remove user ${user.userId}`} id={`removeUser${user.userId}`}  className="p-0     lh-1"  onClick={()=>{removeTaggedUser(user.id)}} ><BsX className="  fs-5" style={{ strokeWidth: '1.5',  }}/></Button>
								 
							</div>
						))
					}
				
				</div>
			}
			
			<div>
					<Button variant="outline-secondary" id="openUserList" title="Select users" className="w-100 border border-2 border-secondary  " onClick={openUserList}> Select Users</Button>
			</div>
      


			<Offcanvas   placement="bottom"  show={showUserList} onHide={handleCloseUserList} className=" bg-white rounded  comment_box_main_Container mx-auto h-100  "  >
        
				<Offcanvas.Header className="bg-white   d-flex gap-2 align-items-start justify-content-between" >
          
					<Offcanvas.Title >Choose the user you'd like to tag</Offcanvas.Title>
					<Button  variant="outline-dark" className=" p-1    border border-2 border-dark  " onClick={handleCloseUserList}  id="closeShowUserListBTN" title="Close user list"  >
						{
							taggedUser.length == 0 ?
							(
								<BsX className="  fw-bold fs-3 " />
							):(
							<BsCheck2 className="  fw-bold fs-3 " />
							)
						}
					
					</Button>
				
				</Offcanvas.Header>
					
				<Offcanvas.Body  className="w-100 p-0 pb-3 mx-0  " >
					<div className="px-2">
						<Form.Group className="py-2 " controlId="PostTag"> 
							<InputGroup className="gap-2">
								{ searching && 
									<Button variant="light" className="py-0 px-2  border-0 rounded " onClick={cancelSearch} id="backButton" title="go to previous page"><BsArrowLeft className="  fw-bold fs-3" /></Button>
								}
								<Form.Control 
								type="text" 
								value={searchInput}
								onChange={(e)=>{setSearchInput(e.target.value)}}
								placeholder="Find user by name or ID.."  
								className="shadow-none bg-light  rounded formInput"
								name="searchInput"  autoComplete="off"  
								
								/> 
								<Button variant="dark" id="userSearchBTNId" title="search user" className=" rounded   " onClick={searchUser}> <BsSearch className=" fs-4" /></Button>
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
									className={` rounded-2    post user_card p-2 ${isUserTagged(user.userID) ? 'postupload_selected_taggeduser  ' : ''}`}
									onClick={()=>{selectUser(user.id, user.userID)}}>
										
										<User user={user} /> 
									
									</div>
									
							</Col>
						
						))}
					</Row>
					 	 
						
						{hasMore && !loading && (
							<LoadMoreButton apiCall={apiCall}  loading={loading} />
						)}
						 
						{loading && <div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>}	
					 
        </Offcanvas.Body>
      </Offcanvas>			
		</div>
	);
	
};

export default memo(UploadNewPostTaggedUser);
