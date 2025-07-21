
import   {memo, useCallback}  from 'react'; 
import Navbar from 'react-bootstrap/Navbar'; 
import Nav from 'react-bootstrap/Nav';   
import { NavLink } from 'react-router-dom';  
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const CommunityDetailFeedType = ({communityId}) => { 
  // Navigation items configuration
  const navItems = [ 
    { to: `/community/${communityId}/detail/posts`, label: 'Posts' },
    { to: `/community/${communityId}/detail/workfolio`, label: 'Workfolio' },
    { to: `/community/${communityId}/detail/problems`, label: 'Problems' },
    { to: `/community/${communityId}/detail/jobs`, label: 'Jobs' },
    { to: `/community/${communityId}/detail/freelance`, label: 'Freelance' }, 
  ];
	
	 /*const handleNavItemClick = useCallback((url) => {
		//let removedURL = manageVisitedUrl(null, 'popUrl'); 
		//manageVisitedUrl(url, 'append');
	 },[ ]);*/

  return ( 
    <div className="w-100 sub_main_container rounded-1 shadow">
      {/* Nav Container*/}
      <Navbar className="p-0 w-100 nav_bar">
        <Nav className="w-100 gap-1 px-2 py-2 overflow-auto justify-content-around">
          {navItems.map(({ to, label }, index) => (
            <Nav.Item key={index} className="flex-grow-1">
              <Nav.Link
                as={NavLink}
                to={to}
								//onClick={() => {handleNavItemClick(to); }}
                className="rounded-1 px-2 py-1  navigation_link explore_navigation_link text-center  "
                title={`Go to ${label.toLowerCase()} page`}
              >
                {label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Navbar>
      
       
    </div>
  );
};

export default memo(CommunityDetailFeedType);
