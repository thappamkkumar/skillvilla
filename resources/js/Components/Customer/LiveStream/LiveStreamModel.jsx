
import   {  useState, useEffect, useRef, useCallback } from 'react';
import debounce from "lodash/debounce";
import { useSelector } from 'react-redux'; 

import MainHeader from './MainHeader/MainHeader';
import PublisherStream from './VideoStreamViews/PublisherStream';
import SidePanel from './SidePanel/SidePanel';
import StreamControlActions from './StreamControlActions/StreamControlActions';
import MessageAlert from '../../../Components/MessageAlert';

import useWindowHeight from "../../../CustomHook/useWindowHeight";


const LiveStreamModel = ({ 
	peerConRef,
	publisherVideoRef,
	localMediaRef
}) =>{
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	const [largeScreen, setLargeScreen] = useState(() => window.innerWidth >= 992);
	const [sidePanel, setSidePanel] = useState(() => window.innerWidth >= 992);
	const [resizeScreen, setResizeScreen] = useState(false);
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message 

	const windowHeight = useWindowHeight();
	
	useEffect(() => {
    const handleResize = debounce(() => {
      const shouldBeOpen = window.innerWidth >= 992;
			 
      setLargeScreen(prev => (prev !== shouldBeOpen ? shouldBeOpen : prev));
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
				className={`  position-fixed top-0 overflow-hidden  bg-dark    ${resizeScreen && 'small-call-container end-0  m-1 rounded-3  '} `}
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
						<div className="flex-grow-1 overflow-hidden     ">
							<div className="w-100 h-100 d-flex position-relative overflow-hidden  "> 
									<div className=" flex-grow-1 	h-100 position-relative overflow-hidden" >
										{/*publisher video*/}
										<PublisherStream 
											localMediaRef={localMediaRef}
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
												localMediaRef={localMediaRef}
												setShowModel={setShowModel}
												setsubmitionMSG={setsubmitionMSG}
											/>
										}
									
									</div>
									
									 
									
									{/* Side Panel*/}
									{!resizeScreen && (
									
										<SidePanel 
											sidePanel={sidePanel}
											largeScreen={largeScreen}
										/>
										
									)}

									
							</div>
						</div>
						
					</div>
			 
				 
				
			</div>
	);
};


export default LiveStreamModel;