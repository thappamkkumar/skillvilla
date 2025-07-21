

import  {useState, useCallback, memo}  from 'react';
import { useSelector, useDispatch  } from 'react-redux'; 
import { NavLink } from 'react-router-dom'; 
 
import {  BsX,   BsQuestionOctagon   ,  BsBriefcase, BsPerson, BsBoxArrowRight, BsCodeSquare, BsGrid, BsPostcard ,  BsFolderPlus, BsCamera, BsCameraReels , BsPeople, BsPersonVcard , BsBuilding , BsChatRightDots  } from 'react-icons/bs'; 
 
 
import  Button  from 'react-bootstrap/Button'; 
import   Navbar from 'react-bootstrap/Navbar'; 
import   Nav  from 'react-bootstrap/Nav';     
import   Offcanvas  from 'react-bootstrap/Offcanvas'; 
 
import { userNavBarToggle } from '../../../StoreWrapper/Slice/userNavBarSlice'; 

 
 
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
 
		 
		//manageVisitedUrl(url, 'addNew');
		 
		handleOnHide();
     
  }, [  dispatch]);

  // Navigation items configuration
  const navItems = [
    { to: '/admin/dashboard', icon: BsGrid, label: 'Dashboard' },
		 { to: '/admin/users', icon: BsPersonVcard, label: 'Users' },
    { to: '/admin/communities', icon: BsPeople, label: 'Communities' },
    { to: '/admin/stories', icon: BsCamera, label: 'Stories' },
    { to: '/admin/lives', icon: BsCameraReels, label: 'Live' },
		{ to: '/admin/posts', icon: BsPostcard, label: 'Posts' },
    { to: '/admin/workfolios', icon: BsFolderPlus, label: 'Workfolio' },
    { to: '/admin/problems', icon: BsQuestionOctagon, label: 'Problems' },
    { to: '/admin/companies', icon: BsBuilding , label: 'Companies' },
    { to: '/admin/jobs', icon: BsBriefcase, label: 'Jobs' },
    { to: '/admin/freelances', icon: BsCodeSquare, label: 'Freelance' },
    { to: '/admin/messages', icon: BsChatRightDots, label: 'Messages' },
		{ to: '/admin/profile', icon: BsPerson, label: 'Profile' },
		{ to: '/admin/logout', icon: BsBoxArrowRight, label: 'Logout' },
    
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