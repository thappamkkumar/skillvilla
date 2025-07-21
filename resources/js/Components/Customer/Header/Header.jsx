import { useState, useEffect, useCallback } from "react";
import { BsList, BsArrowLeft } from "react-icons/bs";
import {   Button, Image } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, useMatch } from "react-router-dom";

import { userNavBarToggle } from "../../../StoreWrapper/Slice/userNavBarSlice"; 
import handleImageError from "../../../CustomHook/handleImageError";
//import manageVisitedUrl from "../../../CustomHook/manageVisitedUrl";

const Header = () => {
  const userNavBar = useSelector((state) => state.userNavBar.toggle);
  const userString = useSelector((state) => state.auth.user);
  const userData = JSON.parse(userString);
   
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const chatMatch = useMatch("/chats/*");

  

  const navigateBack = useCallback(() => {
    //let url = manageVisitedUrl(null, "popUrl");
    navigate(-1);
  }, [navigate]);

  const handleToggle = useCallback(() => {
    dispatch(userNavBarToggle({ toggle: !userNavBar }));
  }, [dispatch, userNavBar]);

  const setCurrentURL = useCallback(
    (url) => {
     /* if (url === "/profile") {
        manageVisitedUrl(url, "addNew");
      }*/
      navigate(url);
    },
    [navigate]
  );

  const showNavButtonPages = [
    "/home",
    "/explore",
    "/explore/users",
    "/explore/posts",
    "/explore/workfolio",
    "/explore/problems",
    "/explore/jobs",
    "/explore/freelance",
    "/explore/lives",
    "/explore/communities",
    "/chats",
    "/communities",
    "/communities/my-community",
    "/communities/joined-community",
    "/stories",
    "/lives",
    "/create",
    "/create/post",
    "/create/workfolio",
    "/create/problem",
    "/create/job",
    "/create/job/register-company",
    "/create/freelance",
    "/create/community",
    "/create/story",
    "/posts",
    "/workfolio",
    "/jobs",
    "/freelance",
    "/problems",
    "/profile",
    "/logout",
  ];

  return (
    <header className="header d-flex align-items-center justify-content-between w-100 py-2 px-1 m-0"  >
			 
			 
				{(showNavButtonPages.includes(location.pathname) || chatMatch) && (
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

				{!showNavButtonPages.includes(location.pathname) &&  !chatMatch &&  (
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

				<Button
					variant="light	"
					onClick={() => setCurrentURL("/profile")}
					id="loggedUSerProfileNavigationBtn"
					title="Go to user profile"
					className={`border-1	 border-secondary py-1 ps-3 pe-1 fw-bold rounded-5	  d-none d-sm-flex align-items-center    	`} 
					style={{backgroundColor : location.pathname == '/profile' && 'rgba(200,200,200,1)' }}
				>
					<span>
						{userData &&
							userData.name
								.split(" ")
								.map(word => word[0].toUpperCase())
								 }
					</span>

					<Image
					  src={userData?.customer?.image || "/images/login_icon.png"}  
						className="comment_profile_image   ms-2	"
						onError={(event) => handleImageError(event, "/images/login_icon.png")}
						alt="User profile"
							
					/>
				</Button>
			 
    </header>
  );
};

export default Header;
