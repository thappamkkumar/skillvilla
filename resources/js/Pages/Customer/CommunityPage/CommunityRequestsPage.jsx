 

import   {    useCallback, useState, useEffect } from 'react';  
import {useParams, useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner'; 
import Offcanvas from 'react-bootstrap/Offcanvas'; 
import Button from 'react-bootstrap/Button'; 

import {   BsX  } from 'react-icons/bs'; 

import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import CommunityRequestList from '../../../Components/Customer/CommunityRequests/CommunityRequestList'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../CustomHook/serverConnection'; 
// import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 

import {updateCommunityRequestState} from '../../../StoreWrapper/Slice/CommunityRequestSlice';

import useCommunitySendRequestWebsocket from '../../../Websockets/Community/useCommunitySendRequestWebsocket'; 
import useCommunityJoinedRequestCancelWebsocket from '../../../Websockets/Community/useCommunityJoinedRequestCancelWebsocket'; 


const CommunityRequestsPage = ( ) => {
	
	const { communityId } = useParams(); 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
	 
	const requestList = useSelector((state) => state.communityRequestList);  
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const navigate = useNavigate();
	 
	const [loading, setLoading] = useState(false);
 
 // Call the  hook for websockets event listeners
	useCommunitySendRequestWebsocket(  
		logedUserData,  
		communityId
	);
	useCommunityJoinedRequestCancelWebsocket(  
		logedUserData,  
		communityId
	);
	
	
	const apiCall = useCallback(async()=>{ 
		if(authToken == null || communityId == null) return;
		try
		{
			 
			setLoading(true); 
			   
			// Construct request data
			const requestData = {
					community_id: communityId, 
			};
			
			let data =await serverConnection(`/get-community-request?cursor=${requestList.cursor}`, requestData, authToken);
			 
			  //console.log(data);
			if(data != null && data.requestList != null )
			{
				if(data.requestList.data.length != 0 )
				{ 
					dispatch(updateCommunityRequestState({type : 'SetCommunityRequests', requestList: data.requestList.data}));  
				}
				 
				dispatch(updateCommunityRequestState({type : 'SetCursor', cursor: data.requestList.next_cursor})); 
				dispatch(updateCommunityRequestState({type : 'SetHasMore', hasMore: data.requestList.next_cursor != null})); 
			}
			  
		}
		catch(error)
		{
			console.log(error);
			 
		}
		finally
		{
			 setLoading(false);
		}
	},[dispatch, requestList.cursor,   communityId, authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(requestList.requestList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, requestList.requestList.length]);
	
	
	
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateCommunityRequestState({type : 'SetScrollHeightPosition', scrollHeightPosition: scrollTop})); 
    
  }, [dispatch]); 
  
	    
	 
    //function for navigate back
	const navigateBack = useCallback(() =>
	{ 
		//call function to pop the url from array of visited url
		//let url = manageVisitedUrl(null, 'popUrl');
	 
		 navigate(-1); 
	},[]); 
	  
  
  
	//add job form
	return ( 
		<>
			<PageSeo 
				title="Community Requests | SkillVilla"
				description="View and manage community requests on SkillVilla."
				keywords="community requests, SkillVilla, request management"
			/>



			<Offcanvas   placement="bottom"  show={true} onHide={navigateBack} className="  rounded  comment_box_main_Container mx-auto   "  >
					
				<Offcanvas.Header className="   d-flex flex-wrap justify-content-between border-bottom" >
					<Offcanvas.Title>Requests</Offcanvas.Title>
						<Button  
						variant="outline-dark" 
						 onClick={navigateBack}
						className=" p-1    border border-2 border-dark " 
						id="closeShowUserListBTN" 
						title="Close user list"  >
							<BsX className="  fw-bold fs-3 " />
						</Button>
					
					</Offcanvas.Header>    
					<Offcanvas.Body  className="w-100 p-0      " >
						<InfiniteScrollContainer
							fetchData={apiCall}
							hasMore={requestList.hasMore}
							loading={loading}
							initialScrollPosition={requestList.scrollHeightPosition}
							onScrollUpdate={handleScrollUpdate}
							style="main_container pb-5  "
						> 
							{
								 (requestList.requestList.length <= 0 && !loading) &&
								 ( 
										<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
										<p className="no_posts_message ">
											This community has no requests yet.  
										</p>
										</div>
								 )
							}
							{		
								(requestList.requestList.length > 0 && !loading) &&	
								 ( 
											<CommunityRequestList requestList={requestList.requestList} />
								 )
							} 
							 
						</InfiniteScrollContainer>
			
				</Offcanvas.Body>
			</Offcanvas>	
		</>	
			
	);
	
};

export default CommunityRequestsPage;
