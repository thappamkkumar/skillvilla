import React, { useState,  } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
 
// Components
import Header from '../Components/Admin/Header/Header';
import NavBarContainer from '../Components/Admin/NavBar/NavBarContainer';

// Hook for visited URL
import manageVisitedUrl from '../CustomHook/manageVisitedUrl';
import useWindowHeight from '../CustomHook/useWindowHeight';
 
 
const AdminLayoutPage = () => {
  const is_login = useSelector((state) => state.auth.is_login); // Check login status
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // Get logged-in user info
	const windowHeight = useWindowHeight();
	const navigate = useNavigate();

	 
/*
  useEffect(() => {
		 
    if (!is_login) {
       navigate('/login'); // Redirect to home if not logged in
    } else if (is_login && logedUserData.user_role === 'Customer') {
       navigate('/home'); // Redirect to customer dashboard if role is Customer
    } 
  }, [is_login, logedUserData, navigate]);
*/

		

  return (
    <div className="  layout-container" style={{ height: windowHeight }}>
      <NavBarContainer className="sidebar" />
      <div className="main-content">
        <Header />
        <div className="content" >
          <Outlet /> {/* Render nested routes */}
        </div>
      </div>

      
    </div>
  );
};

export default AdminLayoutPage;
