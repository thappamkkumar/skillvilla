 
 import   {useState, useCallback, memo, useEffect}  from 'react';  
import {useDispatch,   useSelector } from 'react-redux'; 
import { NavLink } from 'react-router-dom';  
import  Button  from 'react-bootstrap/Button'; 
import   Navbar from 'react-bootstrap/Navbar'; 
import   Nav  from 'react-bootstrap/Nav';   

 import { BsChevronCompactLeft,
 BsChevronCompactRight,  
 BsQuestionOctagon,
 BsBriefcase, 
 BsPerson,
 BsBoxArrowRight,
 BsCodeSquare,  
 BsGrid, 
 BsPostcard , 
 BsFolderPlus,
 BsCamera, 
 BsCameraReels , 
 BsPeople,  
 BsPersonVcard,    
 BsBuilding , 
	BsChatRightDots, 
 } from 'react-icons/bs'; 
 
 
 import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';


const LargeScreen = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Handle sidebar toggle
  const toggleSidebar = useCallback(() => {setIsOpen((prev) => !prev)},[]);
	const dispatch = useDispatch();
	
	
	//handle nav item click and set url in visitedUrl and refesh the redux state
  const handleNavItemClick = useCallback((url) => {
	  
		dispatch(updateListState({type : 'refresh'})); 
	//	manageVisitedUrl(url, 'addNew');
     
  }, [   ]); 
	 

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
									<Nav.Item key={index} className="mb-2">
										<Nav.Link
											as={NavLink}
											to={to}
											onClick={() => {handleNavItemClick(to); }}
											className={`d-flex align-items-center ${!isOpen && 'justify-content-center text-center'} rounded navigation_link px-2 `} 
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
