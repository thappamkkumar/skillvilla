 
import {memo, useEffect, useState, useRef, useCallback  } from 'react';
import {useSelector, useDispatch } from 'react-redux';   
import Button from 'react-bootstrap/Button';  
import Offcanvas from 'react-bootstrap/Offcanvas'; 
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';   
import Form from 'react-bootstrap/Form'; 
import InputGroup from 'react-bootstrap/InputGroup'; 

import {BsSearch, BsArrowLeft  } from 'react-icons/bs'; 

import ExploreCommunity from '../../ExploreCommunity/ExploreCommunity'
import LoadMoreButton from '../../../Common/LoadMoreButton';
 
import { updateShareStatsState } from '../../../../StoreWrapper/Slice/ShareStatsSlice';
 
import serverConnection from '../../../../CustomHook/serverConnection';

			

const CommunityList = ({selectedCommunities = [], setSelectedCommunities}) => 
{ 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from 
	const communityList= useSelector((state) => state.shareStats.communityList);  
	const communityCursor= useSelector((state) => state.shareStats.communityCursor);  
	const communityHasMore= useSelector((state) => state.shareStats.communityHasMore); 
 
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
			let customCursor = communityCursor;
			//when first time api call cursor set. and when searching have to set cursor null first and then searching, updating cursor state ceate issue becasue state updated parallely so that when searhing using null for cursor
			if(cursorNull == true)
			{ 
				customCursor = null;
			}
		
		
			//call the function fetch   data fron server
			 
			const url = `/get-communities-for-share?cursor=${customCursor}`;
			
			const requestData = { };
			if(searchInput.trim() != '' && cancelSearch == false)
			{ 
				requestData.searchInput = searchInput;
			}
			//call the function fetch   data from server
			let result = await serverConnection(url, requestData, authToken);
			
			 
	  	//console.log(result);
			 
			
			if(result != null && result.communityList != null )
			{
				if(result.communityList.data.length == 0 )
				{ 
					setSearchError(true); 
				}
				else
				{ 
					setSearchError(false); 
				}
				
				dispatch(updateShareStatsState({
					type : 'SetCommunityList', 
					communityList: result.communityList.data,
					append: customCursor != null, 
				}));  
				
				dispatch(updateShareStatsState({type : 'SetCommunityCursor', communityCursor: result.communityList.next_cursor})); 
				dispatch(updateShareStatsState({type : 'SetCommunityHasMore', communityHasMore: result.communityList.next_cursor != null})); 
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
			
	},[authToken, dispatch, communityCursor, searchInput]); 

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
	}, [authToken]);
	
	
	
	
	//function use to remove community from selected community list
	const removeSelectedCommunity= useCallback((id)=>{
		const updatedCommunities = selectedCommunities.filter(community => community.id !== id);
    setSelectedCommunities(updatedCommunities);
		
	}, [selectedCommunities]);
	
	// Check if a community is selected
  const isCommunitySelected = useCallback((id) => {
    return selectedCommunities.some(selected => selected.id === id);
  }, [selectedCommunities]);
	
	
	
	
	
	//function use to handle selecting community and push into   community List 
	const selectCommunity = useCallback((id)=>{
	 
		const idExists = isCommunitySelected(id);
	   
		if(!idExists) 
		{ 
			setSelectedCommunities((prevItems)=>[{ id: id}, ...prevItems]);	
		} 
		else
		{
			removeSelectedCommunity(id);
		}
	}, [selectedCommunities, isCommunitySelected, removeSelectedCommunity]);
	


	//function use to cancel searhing
	const cancelSearch = useCallback(()=>{
	  dispatch(updateShareStatsState({
					type : 'SetCommunityList', 
					communityList: [],
					append: false, 
				})); 
		setSearchInput('');
		setSearching(false);
		apiCall(true, true);
			 
	}, [ setSearching, setSearchInput,  apiCall]);
	
	//function use to call function apiCall() to fetch data 
	const searchCommunity = useCallback(()=>{
	 
			if(searchInput.trim() != '')
			{ 
				dispatch(updateShareStatsState({
					type : 'SetCommunityList', 
					communityList: [],
					append: false, 
				})); 
				setSearching(true);
				apiCall(true);
					 
			}
		 
		 
	}, [searchInput,setSearching, apiCall]);
	
	
	return ( 
		 
    <div className="pt-2">
			
				<div className="px-2 ">
					<Form.Group className="py-2 " controlId="shareCommunityId"> 
						<InputGroup className="gap-2">
							{ searching && 
								<Button variant="light" className="py-0 px-2  border-0 rounded " onClick={cancelSearch} id="backButton" title="Go to previous page"><BsArrowLeft className="  fw-bold fs-3" /></Button>
							}
							<Form.Control 
							type="text" 
							value={searchInput}
							onChange={(e)=>{setSearchInput(e.target.value)}}
							placeholder="Find Community by name..."  
							className="shadow-none bg-light  rounded formInput"
							name="searchInput"  autoComplete="off"  
							
							/> 
							<Button variant="dark" id="communitySearchBTNId" title="Search community" className=" rounded   " onClick={searchCommunity}> <BsSearch className=" fs-4" /></Button>
						</InputGroup>
						
					</Form.Group>
					
					{searchError && !loading &&
						<div className=" pt-3 text-center">
							<h4>We couldn't find any community for your search.</h4>
							<p className="text-muted">
								Try searching for something else!
							</p>
						</div>
					}
					
				</div>
					
				<Row className="w-100 mx-auto    p-0   ">
					{communityList != null && communityList.map((community) => (
						<Col xs={6} sm={4} md={3} lg={3} key={community.id} className="  m-0 p-2">
							
							<div 
								className={` rounded-2    post user_card p-2 ${isCommunitySelected(community.id) ? 'postupload_selected_taggeduser  ' : ''}`}
								onClick={()=>{selectCommunity(community.id)}}>
									
								<ExploreCommunity community={community} />
								
								</div>
								
						</Col>
					
					))}
				</Row>
					 	 
						
				{communityHasMore && !loading && (
					<LoadMoreButton apiCall={apiCall}  loading={loading} />
				)}
				 
				{loading && <div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>}	
				
      </div>	
	);
	
};

export default memo(CommunityList);
