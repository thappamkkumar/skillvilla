 
import {memo, useState, useEffect, useCallback, useRef } from 'react'; 
import {useSelector } from 'react-redux'; 
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import   Navbar from 'react-bootstrap/Navbar'; 
import   Nav  from 'react-bootstrap/Nav';  

import FollowersFollowing from './FollowersFollowing';
import LoadMoreButton from '../../../../Components/Common/LoadMoreButton';
import PageSeo from '../../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../../CustomHook/serverConnection';
import handleImageError from '../../../../CustomHook/handleImageError'; 
import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
 
const FollowingsPage = () => { 
	
	const { userId, ID } = useParams(); // get id from URL parameter	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store

	const [followingsList, setFollowingsList] = useState([]);//state to store list of followers 
	const [cursor, setCursor] = useState(null);//state to store cursor key
	const [hasMore, setHasMore] = useState(true);//state to store cursor key
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const scrollRef = useRef(null);
	
	//function use to update visited url array list
	const handleNavigate = useCallback((url)=>
	{ 
		//call function to add current url into array of visited url
		manageVisitedUrl(null, "popUrl"); 
			manageVisitedUrl(url, 'append');		
	}, []);
	 
	//function that call the function that fetch the data
	const apiCall = useCallback(async()=>{ 
      try 
			{
        setLoading(true);
				let reqiredData = {
					userId : ID,//user id for fetching data. it is not authanticated user id
				};
				 
				let url = `/following-list?cursor=${cursor}`;
				 
        // Call the function to fetch data from the server
        const fetchedData = await serverConnection(url, reqiredData, authToken);
				
				//console.log(fetchedData);
				if(fetchedData.status == true)
				{
					setFollowingsList(prevList => [...prevList, ...fetchedData.followings.data]);
					setCursor(fetchedData.followings.next_cursor);
					setHasMore(fetchedData.followings.next_cursor != null);
				
				}
				
				setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          //console.log('Request canceled', error.message);
        } else {
         // console.error(error);
        }
        setLoading(false);
      }
   },[cursor, authToken]);
	 
	 
	//useEffect use to call apiCal function on intial load
	useEffect(() => {
    const source = axios.CancelToken.source(); // Create a cancel token source
     
			apiCall(); 
	
    return () => {
      // Cancel the request when the component unmounts
      source.cancel('Request canceled due to component unmount');
    };
  }, []);
	
	
	//function for call apoCall function or fetch more data on scroll reach bottom of page 
	 const fetchMoreData = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
			 
      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading &&  hasMore) {
       apiCall();  
      }
    }
  }, [loading, hasMore]);
	
	//hook for add scroll event to call function for fetching new data
  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
		 	let source2 = axios.CancelToken.source(); 
      ref.addEventListener('scroll', fetchMoreData);
      return () => 
			{  
				ref.removeEventListener('scroll', fetchMoreData);
				// Cancel the request when the component unmounts 
        source2.cancel('Request canceled due to component unmount '); 
			};
    }
  }, [fetchMoreData]);	
	
	return ( 
		<>
			<PageSeo 
				title="Following | SkillVilla"
				description="See the professionals you follow on SkillVilla."
				keywords="following, followed users, SkillVilla, connections"
			/>

			<div  ref={scrollRef} className=" pt-2 pb-5 px-0 m-0 main_container" >
				<div   className="h-auto  mx-auto followerFollowingListContainer " >
					 
						<Navbar  className="nav_bar" >
							<Nav variant="pills"   className="w-100    " >
								{/* Nav Links */}
								<Nav.Item className=" w-100" >
									<Nav.Link as={NavLink} to={`/user/${userId}/${ID}/followers` } onClick={()=>{handleNavigate(`/user/${userId}/${ID}/followers`)}} className="  border border-1  rounded-0 text-center navigation_link ">
										Followers   
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className=" w-100 " >
									<Nav.Link as={NavLink} to={`/user/${userId}/${ID}/followings` } onClick={()=>{handleNavigate(`/user/${userId}/${ID}/followings`)}} className="  border border-1  rounded-0 text-center navigation_link  ">
										Followings   
									</Nav.Link>
								</Nav.Item>
							</Nav>	
						</Navbar>
						 
						 {followingsList.length !== 0 && followingsList.map((followersFollowing, index) => ( 
							 
							<FollowersFollowing  key={index} followersFollowing={followersFollowing} followType="followings"/>
							 
						))} 
						
						
						{
							(!loading && followingsList.length === 0) &&
							(
								<p className="text-center py-4 "><strong>
									No user in  following   list.</strong>
								</p>
							)
						}
						{hasMore && !loading && (
							<LoadMoreButton apiCall={apiCall}  loading={loading} />
						)}
						
						{loading && 
							<div className="py-4     w-100 h-auto text-center">
								<Spinner animation="border" size="md" />
							</div>
						}
					
					
					
				</div>
			</div>
		</>
	);
	
};

export default memo(FollowingsPage);
