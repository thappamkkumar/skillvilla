 

import   {    useCallback, useState, useEffect } from 'react';  
import {useParams, useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner'; 
import Offcanvas from 'react-bootstrap/Offcanvas'; 
import Button from 'react-bootstrap/Button'; 

import {   BsX  } from 'react-icons/bs'; 

import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import CommunityMemberList from '../../../Components/Customer/CommunityMembers/CommunityMemberList'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)



import serverConnection from '../../../CustomHook/serverConnection'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 
import {updateCommunityMemberState} from '../../../StoreWrapper/Slice/CommunityMemberSlice';

import useCommunityJoinedWebsocket from '../../../Websockets/Community/useCommunityJoinedWebsocket'; 
import useCommunityLeavedWebsocket from '../../../Websockets/Community/useCommunityLeavedWebsocket'; 
 

const CommunityMembersPage = ( ) => {
	const { communityId } = useParams(); 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
	 
	const memberList = useSelector((state) => state.communityMemberList);  
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
 
	// Call the  hook for websockets event listeners
	useCommunityJoinedWebsocket(  
		logedUserData,  
		communityId
	);
	useCommunityLeavedWebsocket(  
		logedUserData,  
		communityId
	);
	 
	
	
	  
	const apiCall = useCallback(async()=>{ 
		if(authToken == null || communityId == null) return;
		try
		{
			 
			setLoading(true);
			//call the function fetcg post data fron server
			
			  // Determine if we need to fetch the community owner
			const getCommunityOwner = !memberList.communityOwner;

			// Construct request data
			const requestData = {
					community_id: communityId,
					getCommunityOwner: getCommunityOwner, // Pass true if owner data is missing, otherwise false
			};
			let data =await serverConnection(`/get-community-members?cursor=${memberList.cursor}`, requestData, authToken);
			 
			 //console.log(data);
			if(data != null && data.memberList != null )
			{
				if(data.memberList.data.length != 0 )
				{
					dispatch(updateCommunityMemberState({type : 'SetCommunityMembers', memberList: data.memberList.data}));  
				}
				if(data.communityOwner)
				{
					 
					dispatch(updateCommunityMemberState({type : 'SetCommunityOwner', communityOwner: data.communityOwner})); 
				}
				dispatch(updateCommunityMemberState({type : 'SetCursor', cursor: data.memberList.next_cursor})); 
				dispatch(updateCommunityMemberState({type : 'SetHasMore', hasMore: data.memberList.next_cursor != null})); 
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
	},[dispatch, memberList.cursor, memberList.communityOwner, communityId, authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(memberList.memberList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, memberList.memberList.length]);
	
	
	
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateCommunityMemberState({type : 'SetScrollHeightPosition', scrollHeightPosition: scrollTop})); 
    
  }, [dispatch]); 
  
	  
  //function for navigate back
	const navigateBack = useCallback(() =>
	{ 
		//call function to pop the url from array of visited url
		//let url = manageVisitedUrl(null, 'popUrl');
	 
		 navigate(-1); 
	},[]);
  
	 
	return (  
		<>
			<PageSeo 
				title="Community Members | SkillVilla"
				description="Discover members of various communities on SkillVilla."
				keywords="community members, SkillVilla, community engagement"
			/>

			<Offcanvas   placement="bottom"  show={true} onHide={navigateBack} className="  rounded  comment_box_main_Container mx-auto   "  >
					
				<Offcanvas.Header className="   d-flex flex-wrap justify-content-between border-bottom" >
					<Offcanvas.Title>Members</Offcanvas.Title>
						<Button  
						variant="outline-dark" 
						 onClick={navigateBack}
						className=" p-1  border border-2 border-dark  " 
						id="closeShowUserListBTN" 
						title="Close user list"  >
							<BsX className="  fw-bold fs-3 " />
						</Button>
					
				</Offcanvas.Header>    
				<Offcanvas.Body  className="w-100 p-0      " >
					<InfiniteScrollContainer
						fetchData={apiCall}
						hasMore={memberList.hasMore}
						loading={loading}
						initialScrollPosition={memberList.scrollHeightPosition}
						onScrollUpdate={handleScrollUpdate}
						style="main_container pb-5  "
					> 
						 
						{
							 (memberList.memberList.length <= 0 && !loading) &&
							 ( 
									<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
									<p className="no_posts_message ">
										This community has no members yet. Invite others to join and start building your network!
									</p>
									</div>
							 )
						}
						{		
							(memberList.memberList.length > 0 && !loading) &&	
							 (
										
										 
										 <CommunityMemberList memberList={memberList.memberList} /> 
									 
									 
							 )
						} 
					 
					</InfiniteScrollContainer>
				</Offcanvas.Body>
			</Offcanvas>		
					
					
		</>			
					 
	);
	
};

export default CommunityMembersPage;
