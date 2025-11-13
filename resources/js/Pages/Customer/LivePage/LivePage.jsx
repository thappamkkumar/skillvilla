  
import {   memo, useRef, useEffect} from 'react'; 
import {  Outlet } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';  
import { debounce } from "lodash";


import MainPageHeader from "./../../../Components/Customer/LiveList/MainPageHeader";

const LivePage = () => { 
	 const dispatch = useDispatch(); 
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
 
	const scrollRef = useRef(null);
	 
	
	return (
     <div  ref={scrollRef} className="  p-0 m-0 main_container customListGroupContainer" >
         
				<MainPageHeader />
				 
				
				<h2 className="pt-3">Lives </h2>
        
      </div>
     
  );
};

export default  memo(LivePage);
