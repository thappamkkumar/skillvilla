  
import {   memo, useRef, useEffect} from 'react'; 
import {  Outlet } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';  
import { debounce } from "lodash";


import MainPageHeader from "./../../../Components/Customer/LiveStreamList/MainPageHeader";

const LiveStreamPage = () => { 
	const scrollRef = useRef(null);
	const timeoutId = useRef(null);
	const dispatch = useDispatch(); 
	
	//const liveStreamList= useSelector((state) => state.liveStreamList); //selecting live streams list from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
 
	/*
	// Set initial scroll position on mount
	useEffect(() => {
			if (scrollRef.current && liveStreamList.scrollHeightPosition) {
			timeoutId.current = setTimeout(() => { 
					scrollRef.current.scrollTop = liveStreamList.scrollHeightPosition;
				}, 0); // Adjust timeout as needed (100ms for example)
			}

			// Cleanup timeout on component unmount
			return () => {
				if (timeoutId.current) {
					clearTimeout(timeoutId.current);
				}
			};
    
  }, []);
	
	
	
	 // Debounced scroll position update
  const handleScroll = debounce(() => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
        
      dispatch(updateLiveStreamListState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    }
  }, 500);
	
	 useEffect(() => {
    const ref = scrollRef.current;
    if (ref) { 
      ref.addEventListener("scroll", handleScroll);
      return () => { 
        ref.removeEventListener("scroll", handleScroll);
        handleScroll.cancel();
      };
    }
  }, [ handleScroll]);
	
	*/
	
	return (
     <div  ref={scrollRef} className="  p-0 m-0 main_container customListGroupContainer" >
         
				<MainPageHeader />
				 
				<Outlet /> 
					
         
        
      </div>
     
  );
};

export default  memo(LiveStreamPage);
