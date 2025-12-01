

import  {useState, useCallback, memo}  from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { NavLink } from 'react-router-dom'; 
 
import {  BsX,  BsChatRightDots  ,BsQuestionOctagon   ,  BsBriefcase, BsPerson, BsBoxArrowRight, BsCodeSquare, BsGlobe2 ,  BsHouseDoor, BsPostcard ,  BsFolderPlus, BsCamera, BsCameraReels , BsPlusSquare , BsPeople    } from 'react-icons/bs'; 
//import {  AiOutlineQuestionCircle} from 'react-icons/ai'; // Ant Design Icons
//import { HiOutlineFolderOpen } from 'react-icons/hi'; // Heroicons
//import { RiDashboardLine } from 'react-icons/ri'; // Remix Icons
//import { FiGlobe } from 'react-icons/fi'; // Feather Icons
//import { MdOutlinePostAdd } from "react-icons/md";
 
import  Button  from 'react-bootstrap/Button'; 
import   Navbar from 'react-bootstrap/Navbar'; 
import   Nav  from 'react-bootstrap/Nav';     
import   Offcanvas  from 'react-bootstrap/Offcanvas'; 
//import   Image  from 'react-bootstrap/Image'; 

import { userNavBarToggle } from '../../../StoreWrapper/Slice/userNavBarSlice'; 

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
import { updateActiveLiveState } from '../../../StoreWrapper/Slice/ActiveLiveSlice';
 
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'

const SmallScreen = ( ) => {
   
	 const userNavBarVal = useSelector(state => state.userNavBar.toggle); //get state from redux for toggle navbar
	const dispatch  = useDispatch();
 
 //function hide side nav bar for small screen
	const handleOnHide = useCallback(() => 
	{
			dispatch(userNavBarToggle({toggle:false}));
	},[dispatch]);
	
  
	 //handle nav item click and set url in visitedUrl and refesh the redux state
  const handleNavItemClick = useCallback((url) => {
   if(url == '/explore')
		{//adding 'explore/users' insead 'explore' in manageVisitedUrl, becasue when add 'explore' and firest click on explore it redirect to 'explore/users' but in visitedUrl hav explore not explore/users. so when refesh it first naviaget to explore and then explore/users. that fetch users twice. to overcome the issue of fetching users twice, directly use to  add explore/users in visitedUrl
			//manageVisitedUrl('/explore/users', 'addNew');
		}
		else if (url == '/communities')
		{ 
			//same problem as explore user
			//manageVisitedUrl('/communities/my-community', 'addNew');
		}
		else if(url == '/create')
		{ 
			//same problem as explore user
		//	manageVisitedUrl('/create/post', 'addNew');
		}
		else
		{
			//manageVisitedUrl(url, 'addNew');
		}
		
    if (url === '/chats') {
      dispatch(updateChatState({ type: 'refresh' }));
    }else if (url === '/communities') {
			dispatch(updateYourCommunityState({ type: 'refresh' }));
			dispatch(updateSuggestionCommunityState({ type: 'refresh' })); 
    } else if (url === '/stories') {
      dispatch(updateStoriesState({ type: 'refresh' }));
      dispatch(updateUserStoriesState({ type: 'refresh' }));
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
    } else if (url === '/lives/active') {
      dispatch(updateActiveLiveState({ type: 'refresh' }));
		}
		else {
      //alert(`${url} click`);
    }
		
    dispatch(updateShareStatsState({ type: 'refresh' }));
		
		handleOnHide();
     
  }, [ dispatch]);

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
    { to: '/profile', icon: BsPerson, label: 'Profile' },
		{ to: '/logout', icon: BsBoxArrowRight, label: 'Logout' },
  ];
	
	return (
		<>
			 <Offcanvas placement="start" show={userNavBarVal} onHide={handleOnHide} className="smallScreenSideBar">
					<Offcanvas.Header className="d-flex justify-content-end   py-2 px-3  " > 
						<Button variant="outline-dark" className=" p-1 border border-2 border-dark    d-sm-none    " onClick={handleOnHide}  id="sideNavCloseBtn" title="Close side navigation" ><BsX className="  fw-bold fs-3 " /></Button>
					</Offcanvas.Header>
						<Offcanvas.Body className=" p-0 px-2 pb-5">
						{/*<div className="pt-2">
								<Image src="logo/full-logo.png" className= "d-block mx-auto side_nav_full_logo"      alt="Logo of SkillVilla"  /> 
						</div>*/}
							 	{/* Nav Container*/}
							<Navbar  className=" w-100 nav_bar  " >
								<Nav variant="pills" defaultActiveKey="/dashboard" className="w-100  flex-column flex-wrap" >
									{navItems.map(({ to, icon: Icon, label }, index) => (
										<Nav.Item key={index} className="mb-2">
											<Nav.Link
												as={NavLink}
												to={to}
												onClick={() => {handleNavItemClick(to);}}
												className="d-flex align-item-center rounded navigation_link  "
												id={`small_screen_${label.toLowerCase()}_page_navigation`}
												title={`Go to ${label.toLowerCase()} page`}
											>
												<Icon className="fs-5 navigation_link_icon" />
												<span className="p-0 ps-3 ">{label}</span>
											</Nav.Link>
										</Nav.Item>
									))}
									     
								</Nav>
							</Navbar>
									
						</Offcanvas.Body>
				</Offcanvas>
		</>
	);
};

export default memo(SmallScreen);