import { useState, useEffect, useCallback } from "react";
import { BsList, BsArrowLeft } from "react-icons/bs";
import { Container, Button,  } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation,   } from "react-router-dom";

import { userNavBarToggle } from "../../../StoreWrapper/Slice/userNavBarSlice";
//import manageVisitedUrl from "../../../CustomHook/manageVisitedUrl";

const Header = () => {
  const userNavBar = useSelector((state) => state.userNavBar.toggle);
  const userString = useSelector((state) => state.auth.user);
  const userData = JSON.parse(userString);
  const [userProfile, setUserProfile] = useState("login_icon.png");
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
 

  const navigateBack = useCallback(() => {
    //let url = manageVisitedUrl(null, "popUrl");
    navigate(-1);
  }, [navigate]);

  const handleToggle = useCallback(() => {
    dispatch(userNavBarToggle({ toggle: !userNavBar }));
  }, [dispatch, userNavBar]);

  

  const showNavButtonPages = [
    "/admin/dashboard", 
    "/admin/users", 
    "/admin/communities", 
    "/admin/stories",
    "/admin/lives",  
    "/admin/posts",
    "/admin/workfolios",
    "/admin/companies",
    "/admin/jobs",
    "/admin/freelances",
    "/admin/problems", 
    "/admin/profile", 
    "/admin/logout",
    "/admin/messages",
  ];

  return (
    <Container className="header d-flex align-items-center justify-content-between w-100 py-2 px-1 m-0" fluid>
			 
			 
				{showNavButtonPages.includes(location.pathname) && (
					<Button
						variant="light"
						className="py-1 px-2 d-sm-none"
						onClick={handleToggle}
						id="smallScreenOpenNavBarButton"
						title="Open navigation"
					>
						<BsList className="fw-bold fs-3" />
					</Button>
				)}

				{!showNavButtonPages.includes(location.pathname) && (
					<Button variant="light" className="py-0 px-2 border-0" onClick={navigateBack} id="backButton" title="Go back">
						<BsArrowLeft className="fw-bold fs-3" />
					</Button>
				)}

				{/* Centered Logo */}
				<div   className="logo   mx-auto">
					<span className="logo-s">S</span>
					<span className="char">k</span>
					<span className="char">i</span>
					<span className="char">l</span>
					<span className="char">l</span>
					<span className="logo-villa">v</span>
					<span className="logo-villa">i</span>
					<span className="logo-villa">l</span>
					<span className="logo-villa">l</span>
					<span className="logo-villa">a</span>
				</div>

					
			 
    </Container>
  );
};

export default Header;
