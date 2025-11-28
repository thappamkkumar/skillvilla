
import {memo, useState} from 'react';
import { useSelector } from 'react-redux';
import Viewer from './Viewer';

import MessageAlert from '../../../../../MessageAlert';

const ViewersPanel = ({setResizeScreen}) => {
const liveStreamData = useSelector((state) => state.liveStreamData);
 
 const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide 
	
	
	return(
		<div >
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
			
			{liveStreamData?.viewerList?.map((viewer) => ( 
						
				<div     key={viewer.id}  className="        ">
				 
					<Viewer 
						liveId={liveStreamData.liveId} 
						viewer={viewer} 
						setResizeScreen={setResizeScreen} 
						setsubmitionMSG={setsubmitionMSG} 
						setShowModel={setShowModel} 
					/>
					
				</div>
			))} 
					
		</div>
	);

};
export default memo(ViewersPanel);

