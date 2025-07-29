import React, {  useState, useCallback, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
 
import Header from '../Components/Public/Header/Header';
import Footer from '../Components/Public/Footer/Footer';

import useWindowHeight from '../CustomHook/useWindowHeight';
 
 
const PublicLayoutPage = () => {
    const is_login = useSelector((state) => state.auth.is_login); // Check login status
    const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // Get logged-in user info
		const windowHeight = useWindowHeight();
    const currentLocation = useLocation();
    const navigate = useNavigate();
		 
		const mainDivRef = useRef(null); // Reference for the   div

    useEffect(() => {
         if (is_login) {
            if (logedUserData.user_role === 'Customer') {
                navigate('/home');
            } else if (logedUserData.user_role === 'Admin') {
                navigate('/admin/dashboard');
            }
        } 
    }, [is_login, logedUserData, navigate]);
		
		
		  // Debounced resize handler
			 


			useEffect(() => {
        if (mainDivRef.current) {
            mainDivRef.current.scrollTo(0, 0); // Scroll to the top of the main div
        }
			}, [currentLocation]);
	
	
    return (
	 	
			<div ref={mainDivRef} className="main_container " style={{ height: windowHeight }}>
					<Header />
					<main>
							<Outlet /> {/* Render nested routes */}
					</main>
					<Footer />
			</div>
		 
    );
};

export default PublicLayoutPage;
