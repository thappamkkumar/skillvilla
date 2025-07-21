import { memo, useCallback } from 'react';  
import { useDispatch } from 'react-redux'; 
import { NavLink } from 'react-router-dom';  
import Navbar from 'react-bootstrap/Navbar'; 
import Nav from 'react-bootstrap/Nav';   
import { BsPlus } from "react-icons/bs";    
import { updateCommunityState as updateJoinedCommunityState } from '../../../StoreWrapper/Slice/JoinedCommunitySlice';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
 
const CommunityHeader = () => { 
     const dispatch = useDispatch();

    const handleNavItemClick = useCallback((url) => {
		 
			//	manageVisitedUrl(url, 'addNew');
			  
        if (url === '/communities/joined-community') {
        dispatch(updateJoinedCommunityState({ type: 'refresh' }));
        }
    }, [dispatch,    ]);

    return (
        <Navbar className="w-100 px-3 py-0 community_nested_nav_bar  d-flex align-items-center justify-content-between">
            {/* Left-aligned navigation items */}
            <Nav variant="pills" className="d-flex p-0  align-items-center">
                <Nav.Item className=" ">
                    <Nav.Link
                        as={NavLink}
                        to="/communities/my-community"
                        onClick={() => handleNavItemClick('/communities/my-community')}
                        className=" community_nested_navigation_link fw-bold px-2"
                        title="Go to my community page"
                    >
                        My
                    </Nav.Link>
                </Nav.Item> 
								<span className="community_link_divider px-2">|</span>
                <Nav.Item className=" ">
                    <Nav.Link
                        as={NavLink}
                        to="/communities/joined-community"
                        onClick={() => handleNavItemClick('/communities/joined-community')}
                        className="community_nested_navigation_link fw-bold px-2"
                        title="Go to joined community page"
                    >
                        Joined
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            
            {/* Right-aligned create button */}
            <Nav className="p-0">
                <Nav.Item className=" ">
                    <Nav.Link
                        as={NavLink}
                        to="/create/community"
												onClick={() => handleNavItemClick('/communities/create-new')}
                        className=" rounded community_nested_navigation_add_new_community p-1"
                        title="Create a new community"
                    >
                        <BsPlus className="fs-4" style={{ strokeWidth: '1.5' }} />
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default memo(CommunityHeader);
