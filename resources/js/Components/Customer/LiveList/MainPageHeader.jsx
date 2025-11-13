import { memo } from 'react';  

import { NavLink } from 'react-router-dom';  
import Navbar from 'react-bootstrap/Navbar'; 
import Nav from 'react-bootstrap/Nav'; 

import { BsBroadcast } from "react-icons/bs";


 
const MainPageHeader = () => { 


 return (
        <Navbar className="w-100 px-3 py-2 nav_bar live_page_nav_bar d-flex flex-wrap  align-items-center justify-content-between   bg-body-secondary"> 
				
            <Nav variant="pills" className="d-flex flex-wrap p-0 gap-2 align-items-center">
               
							<Nav.Item className=" ">
								<Nav.Link
										as={NavLink}
										to="/lives/following-lives" 
										className="navigation_link   px-2 "
										title="Following Lives"
								>
										Following
								</Nav.Link>
							</Nav.Item>
									
							<Nav.Item className=" "> 
								<Nav.Link
										as={NavLink}
										to="/lives/my-lives" 
										className="   navigation_link     px-2"
										title="My Professional Lives"
								>
										My Lives
								</Nav.Link>
               </Nav.Item> 
								 
                
            </Nav>
						<Nav variant="pills" className="d-flex p-0  align-items-center">
                
                <Nav.Item className=" ">
                    <Nav.Link
                        as={NavLink}
                        to="/lives/active" 
                        className=" exploreFilterClearBTN active_live_nav  px-2 "
                        title="Active Lives"
                    >
                     <BsBroadcast />   Lives
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            
             
        </Navbar>
    );

};

export default memo(MainPageHeader);		