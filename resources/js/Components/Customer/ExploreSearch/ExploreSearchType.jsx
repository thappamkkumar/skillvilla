
import   {useCallback}  from 'react'; 
import Navbar from 'react-bootstrap/Navbar'; 
import Nav from 'react-bootstrap/Nav';   
import { NavLink } from 'react-router-dom';  
import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const ExploreSearchType = () => { 
  // Navigation items configuration
  const navItems = [
    { to: '/explore/users', label: 'Users' },
    { to: '/explore/communities', label: 'Communities' },
    { to: '/explore/posts', label: 'Posts' },
    { to: '/explore/workfolio', label: 'Workfolio' },
    { to: '/explore/problems', label: 'Problems' },
    { to: '/explore/jobs', label: 'Jobs' },
    { to: '/explore/freelance', label: 'Freelance' },
    { to: '/explore/lives', label: 'Lives' }, 
  ];
	
	 const handleNavItemClick = useCallback((url) => { 
		manageVisitedUrl(url, 'addNew');
	 },[manageVisitedUrl]);

  return ( 
    <div className="w-100">
      {/* Nav Container*/}
      <Navbar className="p-0 w-100 nav_bar">
        <Nav className="w-100 gap-1 px-2 py-3 overflow-auto justify-content-around">
          {navItems.map(({ to, label }, index) => (
            <Nav.Item key={index} className="flex-grow-1">
              <Nav.Link
                as={NavLink}
                to={to}
								onClick={() => {handleNavItemClick(to); }}
                className="rounded-1 px-2 py-1  navigation_link explore_navigation_link text-center "
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

export default ExploreSearchType;
