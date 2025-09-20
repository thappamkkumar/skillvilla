
import   {  useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import  Row from "react-bootstrap/Row";
import  Col from "react-bootstrap/Col";

import useWindowHeight from "../../../CustomHook/useWindowHeight";


const LiveStreamModel = ({
	ICE_CONFIG,
	peerConRef,
	publisherVideoRef 
	
}) =>{
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	const [resizeScreen, setResizeScreen] = useState(false);
	
	const windowHeight = useWindowHeight();
	
	
	return(
			<div
				className={`position-fixed top-0 overflow-hidden  bg-dark ${resizeScreen && 'small-call-container end-0  m-1 rounded-3'} `}
				 style={!resizeScreen ? { height: windowHeight, width:'100%',  zIndex:900 } : { zIndex:900}}
			>
				 	<div className="w-100 h-100   d-flex flex-column  ">
						{/*MAIN HEADER*/}
						<div className="text-light bg-primary   ">
							main header timer->left side,  (btn-> resize model, open/close side panel)->right side
						</div>
						{/*BODY*/} 
						<div className="flex-grow-1   ">
							<Row className="w-100 h-100 m-0">
								<Col
									sm={12} lg={7} xl={8} 
									className="bg-success">
										Publisher video and controlls  
									</Col>
								<Col
									sm={12} lg={5} xl={4} 
									className="d-none d-lg-block bg-danger">
										header with menu and body with content.	
									</Col>
							</Row>
						</div>
					</div>
			 
				 
				
			</div>
	);
};


export default LiveStreamModel;