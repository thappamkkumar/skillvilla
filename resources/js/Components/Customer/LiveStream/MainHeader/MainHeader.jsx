
import {memo, useCallback,useState, useRef, useEffect} from 'react';
import { useSelector } from 'react-redux';
import  Button from "react-bootstrap/Button";
import {   
 BsArrowsAngleContract,
 BsArrowsAngleExpand ,
 BsChevronCompactLeft, 
 BsChevronCompactRight, 
 } from "react-icons/bs"; 

const MainHeader = ({
	sidePanel,
	setSidePanel,
	resizeScreen,
	setResizeScreen,
}) =>
{
	const liveStreamData = useSelector((state) => state.liveStreamData);
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	
  const [elapsedTime, setElapsedTime] = useState(0);
	
	const timerRef = useRef(null); 
	 
	const resizeHandlle = useCallback(()=>{
		setResizeScreen(pre => !pre);	
	},[]);
	
	const panelHandlle = useCallback(()=>{
		setSidePanel(pre => !pre);	
	},[]);
	
	
	// hleper function for calcucate accurate time from date  string
	const formatTime = (seconds) => {
		const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
		const secs = String(seconds % 60).padStart(2, "0");
		return `${mins} : ${secs}`;
	};
	  
	
	//useEffect for start live stream duration timer
	useEffect(() => {
		if (!liveStreamData?.startedAt) return;

		const startTime = new Date(liveStreamData.startedAt).getTime();

		const updateTimer = () => {
			const now = Date.now();
			const elapsed = Math.floor((now - startTime) / 1000);
			setElapsedTime(elapsed > 0 ? elapsed : 0);
		};

		updateTimer(); // run once initially
		timerRef.current = setInterval(updateTimer, 1000);

		return () => clearInterval(timerRef.current);
	}, [liveStreamData?.startedAt]);



	
	
	return(
		<div className="d-flex justify-content-between align-items-center p-2 bg-dark   border-bottom border-2 border-secondary ">
			<div>
				{
					!liveStreamData?.isConnecting &&   liveStreamData?.error == null &&  
					
					<span className= {`text-white-50 fw-bold  ${resizeScreen && 'small'} `} >
							{liveStreamData?.startedAt ? formatTime(elapsedTime) : "wait..."}
					</span>
				}
				
			 {
					liveStreamData?.isConnecting && 
					<span
						className=" px-2   text-truncate overflow-hidden text-nowrap text-white-50  "
					>
						Connecting
						<span className="dot-blink">.</span>
						<span className="dot-blink">.</span>
						<span className="dot-blink">.</span>
					</span> 
				}
				{
					!liveStreamData?.isConnecting && liveStreamData?.error && liveStreamData?.error.trim() != "" &&
					<span
						className=" px-2   text-truncate overflow-hidden text-nowrap text-danger  "
					>
					{liveStreamData?.error} 
					</span> 
				}
				
				 
				
			</div>
			<div className="d-flex justify-content-center align-items-center gap-2">
				<Button 
					variant="outline-secondary"
					id="liveScreenResizeBtn"
					title={`${resizeScreen ?'Scale Up':'Scale Down' }`}
					className="border-0 text-light"
					size={`${resizeScreen ?'sm':'md' }`}
					onClick={resizeHandlle}
				>
					{resizeScreen ? <BsArrowsAngleExpand />   : <BsArrowsAngleContract />  }
				</Button>
				
				
				{
					!resizeScreen &&
				 
					<Button 
						variant="secondary"
						id="sidePanelShowHideBtn"
						title={`${sidePanel ?'Close Panel':'Open Panel' }`}
						className="border-0 text-light"
						size={`${resizeScreen ?'sm':'md' }`}
						onClick={panelHandlle}
					> 
						{sidePanel ? 
								<BsChevronCompactRight  />
							: 
								<BsChevronCompactLeft  />
							}
					</Button>
				
				}
				
			</div>
		</div>
	
	);

};

export default memo(MainHeader);