  
import {   memo, useRef, useEffect} from 'react';  
import { useSelector, useDispatch } from 'react-redux';  
import { debounce } from "lodash";


import MainPageHeader from "./../../../Components/Customer/LiveList/MainPageHeader";

const MyLivePage = () => { 
	 const dispatch = useDispatch(); 
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
 
	const scrollRef = useRef(null);
	 
	
	return (
     <div  ref={scrollRef} className="  p-0 m-0 main_container customListGroupContainer" >
         
				<MainPageHeader />
				 
	
				<h2 className="pt-3 ">My Lives </h2>
        
      </div>
     
  );
};

export default  memo(MyLivePage);
