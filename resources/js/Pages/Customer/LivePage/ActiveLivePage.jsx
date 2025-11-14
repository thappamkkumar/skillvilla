  
import {   memo, useRef, useEffect} from 'react'; 
import { useSelector, useDispatch } from 'react-redux';  
import { debounce } from "lodash";
import Row from 'react-bootstrap/Row' 
import Col from 'react-bootstrap/Col' 

import MainPageHeader from "./../../../Components/Customer/LiveList/MainPageHeader";
import QuickLive from "./../../../Components/Customer/LiveType/QuickLive";
import ProfessionalLive from "./../../../Components/Customer/LiveType/ProfessionalLive";

const ActiveLivePage = () => {  
	
	const liveList = useSelector((state) => state.activeLiveList);
	const dispatch = useDispatch(); 
	const scrollRef = useRef(null);
	
	
	
	return (
     <div  ref={scrollRef} className="  p-0 m-0 main_container customListGroupContainer" >
         
				<MainPageHeader />
				<Row className="m-0 flex-row-reverse p-0  ">
					<Col sm={12} xl={3} className="min-vh-100 bg-light py-2 py-xl-4">
						<h3 className="fw-bold  ">Quick Lives</h3>
						<QuickLive />
					</Col>
					
					<Col sm={12} xl={9} className="px-2 px-md-4 py-4">
						<h3 className="fw-bold  ">Professional Lives</h3>
						<ProfessionalLive />
					</Col>
				</Row>
        
      </div>
     
  );
};

export default  memo(ActiveLivePage);
