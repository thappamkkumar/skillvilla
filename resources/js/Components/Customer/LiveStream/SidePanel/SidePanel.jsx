
import {memo} from 'react';


const SidePanel = ({ 
	sidePanel,
	largeScreen,	
}) => {
	
	
	return(
		<div
			className={`
				p-0 m-0 h-100 
				${sidePanel ? "open" : "closed"} 
				${largeScreen 
					? "d-none d-lg-block  live-stream-side-panel-large" 
					: "d-block d-lg-none  position-absolute top-0 end-0 z-3 live-stream-side-panel-small"}
			`}
		>
			<div className="w-100 h-100 bg-dark border-start border-2 border-secondary ">
			
			
			</div>
		</div>
	);

};

export default memo(SidePanel);