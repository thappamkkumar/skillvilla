 
 import   {useState, useCallback, memo, useEffect}  from 'react';  
import {useDispatch, useSelector } from 'react-redux'; 
import { NavLink } from 'react-router-dom';  
import  Button  from 'react-bootstrap/Button'; 
import   Navbar from 'react-bootstrap/Navbar'; 
import   Nav  from 'react-bootstrap/Nav';   

 import { BsChevronCompactLeft,
 BsChevronCompactRight, 
 BsChatRightDots,
 BsQuestionOctagon   ,
 BsBriefcase, 
 BsPerson,
 BsBoxArrowRight,
 BsCodeSquare, 
 BsGlobe2 , 
 BsHouseDoor, 
 BsPostcard , 
 BsFolderPlus,
 BsCameraReels , 
 BsPeople, 
 BsPlusSquare ,
 BsCamera   
 } from 'react-icons/bs'; 
 

import { updatePostState } from '../../../StoreWrapper/Slice/PostSlice';  
import {updateWorkfolioState} from '../../../StoreWrapper/Slice/WorkfolioSlice';
import {updateProblemState} from '../../../StoreWrapper/Slice/ProblemSlice'; 
import { updateChatState } from '../../../StoreWrapper/Slice/ChatSlice';
import {updateStoriesState} from '../../../StoreWrapper/Slice/StoriesSlice';
import {updateStoriesState as updateUserStoriesState} from '../../../StoreWrapper/Slice/UserStoriesSlice';
import {updateJobState} from '../../../StoreWrapper/Slice/JobSlice';
import {updateFreelanceState} from '../../../StoreWrapper/Slice/FreelanceSlice';
import {updateExploreJobFilterState} from '../../../StoreWrapper/Slice/ExploreJobFilterSlice';
import { updateExploreSearchState } from '../../../StoreWrapper/Slice/ExploreSearchSlice';
import { updateUserState } from '../../../StoreWrapper/Slice/UserSlice';
import {updateCommunityState as updateYourCommunityState} from '../../../StoreWrapper/Slice/YourCommunitySlice';
import {updateCommunityState as updateSuggestionCommunityState} from '../../../StoreWrapper/Slice/SuggestionCommunitySlice';
import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';
 
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';


const LargeScreen = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Handle sidebar toggle
  const toggleSidebar = useCallback(() => {setIsOpen((prev) => !prev)},[]);
	const dispatch  = useDispatch();
  //handle nav item click and set url in visitedUrl and refesh the redux state
  const handleNavItemClick = useCallback((url) => {
	 /* if(url == '/explore')
		{//adding 'explore/users' insead 'explore' in manageVisitedUrl, becasue when add 'explore' and firest click on explore it redirect to 'explore/users' but in visitedUrl hav explore not explore/users. so when refesh it first naviaget to explore and then explore/users. that fetch users twice. to overcome the issue of fetching users twice, directly use to  add explore/users in visitedUrl
			//manageVisitedUrl('/explore/users', 'addNew');
		}
		else if(url == '/communities')
		{ 
			//same problem as explore user
			//manageVisitedUrl('/communities/my-community', 'addNew');
		}
		else if(url == '/create')
		{ 
			//same problem as explore user
			//manageVisitedUrl('/create/post', 'addNew');
		}
		else
		{
			//	manageVisitedUrl(url, 'addNew');
		}
		*/
	  
    if (url === '/chats') {
      dispatch(updateChatState({ type: 'refresh' }));
    } else if (url === '/stories') {
      dispatch(updateStoriesState({ type: 'refresh' }));
      dispatch(updateUserStoriesState({ type: 'refresh' }));
    }else if (url === '/communities') {
			dispatch(updateYourCommunityState({ type: 'refresh' }));
			dispatch(updateSuggestionCommunityState({ type: 'refresh' })); 
    } else if (url === '/posts') {
      dispatch(updatePostState({ type: 'refresh' }));
    } else if (url === '/workfolio') {
      dispatch(updateWorkfolioState({ type: 'refresh' }));
    } else if (url === '/problems') {
      dispatch(updateProblemState({ type: 'refresh' }));
    } else if (url === '/jobs') {
      dispatch(updateJobState({ type: 'refresh' }));
    } else if (url === '/freelance') {
      dispatch(updateFreelanceState({ type: 'refresh' }));
    } else if (url === '/explore') {
			dispatch(updateUserState({ type: 'refresh' }));
			dispatch(updatePostState({ type: 'refresh' }));
		  dispatch(updateWorkfolioState({ type: 'refresh' }));
		  dispatch(updateProblemState({ type: 'refresh' }));
			dispatch(updateJobState({ type: 'refresh' }));
			dispatch(updateFreelanceState({ type: 'refresh' }));
			dispatch(updateSuggestionCommunityState({ type: 'refresh' }));
			dispatch(updateExploreJobFilterState({ type: 'refresh' }));
			dispatch(updateExploreSearchState({ type: 'refresh' }));
    } else {
      //alert(`${url} click`);
    }
		
		
    dispatch(updateShareStatsState({ type: 'refresh' }));
		
  }, [  dispatch]); 
	//handle nav item click and   refesh the redux state
 /* const handleStateRefresh = useCallback((url) => {
		  
      if (url === '/chats') {
      dispatch(updateChatState({ type: 'refresh' }));
    } else if (url === '/stories') {
      dispatch(updateStoriesState({ type: 'refresh' }));
    } else if (url === '/posts') {
      dispatch(updatePostState({ type: 'refresh' }));
    } else if (url === '/workfolio') {
      dispatch(updateWorkfolioState({ type: 'refresh' }));
    } else if (url === '/problems') {
      dispatch(updateProblemState({ type: 'refresh' }));
    } else {
      alert(`${url} click`);
    }
       
  }, [dispatch]);*/

  // Navigation items configuration
  const navItems = [
    { to: '/home', icon: BsHouseDoor, label: 'Home' },
    { to: '/explore', icon: BsGlobe2, label: 'Explore' },
    { to: '/chats', icon: BsChatRightDots, label: 'Chat' },
    { to: '/communities', icon: BsPeople, label: 'Communities' },
    { to: '/stories', icon: BsCamera, label: 'Stories' },
    { to: '/lives/active', icon: BsCameraReels, label: 'Lives' },
		{ to: '/create', icon: BsPlusSquare, label: 'Create' },
    { to: '/posts', icon: BsPostcard, label: 'Posts' },
    { to: '/workfolio', icon: BsFolderPlus, label: 'Workfolio' },
    { to: '/problems', icon: BsQuestionOctagon, label: 'Problems' },
    { to: '/jobs', icon: BsBriefcase, label: 'Jobs' },
    { to: '/freelance', icon: BsCodeSquare, label: 'Freelance' },
			{ to: '/logout', icon: BsBoxArrowRight, label: 'Logout' },
    
  ];



 // Listen for screen size changes using matchMedia
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 992px)');
    
    const handleMediaChange = (e) => {
      setIsOpen(!e.matches); // If the screen width is <= 992px, close the sidebar
    };

    // Add media query listener
    mediaQuery.addEventListener('change', handleMediaChange);

    // Initial check
    handleMediaChange(mediaQuery);

    // Cleanup on component unmount
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);


  return (
    <>
			{/* Side navigation container for screen with greater than 768px */}
				<div className={` px-2     fullSideNavBar ${!isOpen && 'w-auto'} `}   >
					
					<div   className={`px-0 py-2 d-flex align-item-center ${isOpen ? 'justify-content-end' : ' justify-content-center'}  `}  >
						
					 
						<Button variant="outline-dark" onClick={toggleSidebar} className=" p-1 border border-2 border-dark   "  id="LargeScreenNavToggleBtn" title="Toggle navigation" >
							{isOpen ? 
								<BsChevronCompactLeft className="fs-4"  style={{ strokeWidth: '1',  }}   />
							: 
								<BsChevronCompactRight className="fs-4" style={{ strokeWidth: '1',  }}   />
							}
						</Button >
					</div>
					
					{/*<div className="pt-2">
						<Image src={`/logo/${isOpen ? 'full-logo.png' : 'logo.png'}  `} className= {`d-block mx-auto ${isOpen ? 'side_nav_full_logo' : 'side_nav_logo'}   `}  alt="Logo Of SkillVilla"  /> 
					</div>*/}
					 
					
					{/* Nav Container*/}
					<Navbar  className=" w-100 nav_bar     pb-4 " >
							 
							<Nav variant="pills"   className=" w-100  flex-column flex-wrap" >
								{navItems.map(({ to, icon: Icon, label }, index) => (
									<Nav.Item key={index} className="  mb-2 ">
										<Nav.Link
											as={NavLink}
											to={to}
											onClick={() => {handleNavItemClick(to); }}
											className={`d-flex align-items-center ${!isOpen && 'justify-content-center text-center'} rounded navigation_link px-2   `} 
											title={`Go to ${label.toLowerCase()} page`}
										>
											<Icon className="fs-5 navigation_link_icon" />
											<span className={`p-0 ps-3 ${isOpen ? 'd-block' : 'd-none'}`}>{label}</span>
										</Nav.Link>
									</Nav.Item>
								))}
									 
							</Nav>
					</Navbar>
					 
				</div> 
		</>
  );
};

export default memo(LargeScreen);
