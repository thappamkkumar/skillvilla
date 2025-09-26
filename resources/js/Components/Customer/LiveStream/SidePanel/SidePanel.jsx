
import {memo, useState, useCallback} from 'react';

import SidePanelHeader from './SidePanelHeader';
import ChatPanel from './Panels/ChatPanel/ChatPanel';
import ViewersPanel from './Panels/ViewersPanel/ViewersPanel';
import RequestsPanel from './Panels/RequestsPanel/RequestsPanel';
import MembersPanel from './Panels/MembersPanel/MembersPanel';

const SidePanel = ({ 
	sidePanel,
	largeScreen,	
}) => {
	
	const [selectedPanel, setSelectedPanel] = useState('chat');
	
	 // Map panel codes to their content
  const panelContent = {
    chat: <ChatPanel />,
    viewer: <ViewersPanel  />,
    request: <RequestsPanel />,
    member: <MembersPanel />,
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
			<div className="w-100 h-100 bg-dark border-start border-2 border-secondary   d-flex flex-column">
				<SidePanelHeader 
					selectedPanel={selectedPanel}
					setSelectedPanel={setSelectedPanel}
				/>
				<div className="flex-grow-1 overflow-hidden    ">
				
					{panelContent[selectedPanel] || <div>Unknown panel</div>} 
					 
				</div>
				
			
			</div>
		</div>
	);

};

export default memo(SidePanel);