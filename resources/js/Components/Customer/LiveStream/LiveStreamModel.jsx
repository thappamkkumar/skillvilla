
import   {  useState, useEffect, useRef, useCallback } from 'react';
import debounce from "lodash/debounce";
import { useSelector } from 'react-redux';
import  Row from "react-bootstrap/Row";
import  Col from "react-bootstrap/Col";

import MainHeader from './MainHeader/MainHeader';
import PublisherStream from './VideoStreamViews/PublisherStream';
import StreamControlActions from './StreamControlActions/StreamControlActions';
import MessageAlert from '../../../Components/MessageAlert';

import useWindowHeight from "../../../CustomHook/useWindowHeight";


const LiveStreamModel = ({ 
	peerConRef,
	publisherVideoRef 
	
}) =>{
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	const [sidePanel, setSidePanel] = useState(() => window.innerWidth >= 992);
	const [resizeScreen, setResizeScreen] = useState(false);
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message 

	const windowHeight = useWindowHeight();
	
	useEffect(() => {
    const handleResize = debounce(() => {
      const shouldBeOpen = window.innerWidth >= 992;
      setSidePanel(prev => (prev !== shouldBeOpen ? shouldBeOpen : prev));
    }, 150); // wait 150ms after resize stops

    window.addEventListener("resize", handleResize);

    return () => {
      handleResize.cancel(); // cancel any pending debounce
      window.removeEventListener("resize", handleResize);
    };
  }, []);
 
 
	return(
			<div
				className={`position-fixed top-0 overflow-hidden  bg-dark    ${resizeScreen && 'small-call-container end-0  m-1 rounded-3  '} `}
				 style={!resizeScreen ? { height: windowHeight, width:'100%',  zIndex:900 } : { zIndex:900}}
			>
					<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
					
				 	<div className="w-100 h-100   d-flex flex-column  ">
						
						
						{/*MAIN HEADER*/}
						<MainHeader 
							sidePanel={sidePanel}
							setSidePanel={setSidePanel}
							resizeScreen={resizeScreen}
							setResizeScreen={setResizeScreen}
						/>
						
						{/*BODY*/} 
						<div className="flex-grow-1     ">
							<div className="w-100 h-100 d-flex position-relative  "> 
									<div className=" flex-grow-1 	h-100 position-relative " >
										{/*publisher video*/}
										<PublisherStream 
											publisherVideoRef={publisherVideoRef}
											setShowModel={setShowModel}
											setsubmitionMSG={setsubmitionMSG}
										/>
										
										{/*manual controller*/}
										{
											!resizeScreen &&
											<StreamControlActions 
												peerConRef={peerConRef}
												publisherVideoRef={publisherVideoRef}
												setShowModel={setShowModel}
												setsubmitionMSG={setsubmitionMSG}
											/>
										}
									
									</div>
									
										{
											!resizeScreen &&  
											<div 
											className={`d-none d-lg-block p-0 m-0 h-100 bg-info live-stream-side-panel-large ${
													sidePanel ? "open" : "closed"
												}`}
											 
											>
												side panel for large screen	
											</div>
										}
									{
										!resizeScreen && 
										<div 
										className={`d-block d-lg-none p-0 m-0 h-100 bg-danger 		position-absolute top-0 end-0 z-3 live-stream-side-panel-small ${ sidePanel ? "open" : "closed"	}`}
										 
										>
											side panel for small screen	
										</div>
									}
									
							</div>
						</div>
						
					</div>
			 
				 
				
			</div>
	);
};


export default LiveStreamModel;