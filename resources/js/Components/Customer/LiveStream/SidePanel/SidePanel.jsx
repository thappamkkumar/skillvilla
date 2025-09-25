
import {memo, useState, useCallback} from 'react';

import SidePanelHeader from './SidePanelHeader';

const SidePanel = ({ 
	sidePanel,
	largeScreen,	
}) => {
	
	const [selectedPanel, setSelectedPanel] = useState('chat');
	
	 // Map panel codes to their content
  const panelContent = {
    chat: <div>Chat</div>,
    viewer: <div>Viewer</div>,
    request: <div>Request</div>,
    member: <div>Member</div>,
  };
	
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
				<SidePanelHeader 
					selectedPanel={selectedPanel}
					setSelectedPanel={setSelectedPanel}
				/>
				<div className="text-white">
				
					{panelContent[selectedPanel] || <div>Unknown panel</div>} 
					 
				</div>
				
			
			</div>
		</div>
	);

};

export default memo(SidePanel);