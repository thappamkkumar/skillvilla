  
import {   memo, useRef, useEffect} from 'react'; 
import { useSelector, useDispatch } from 'react-redux';  
import { debounce } from "lodash";


import MainPageHeader from "./../../../Components/Customer/LiveList/MainPageHeader";

const ActiveLivePage = () => { 
	 const dispatch = useDispatch(); 
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
	const liveList = useSelector((state) => state.activeLiveList); 
	
	const scrollRef = useRef(null);
	 
	 console.log(liveList);
	
	return (
     <div  ref={scrollRef} className="  p-0 m-0 main_container customListGroupContainer" >
         
				<MainPageHeader />
				 
 
        
      </div>
     
  );
};

export default  memo(ActiveLivePage);
