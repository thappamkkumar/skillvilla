

import   { useEffect } from 'react';
import { useSelector } from 'react-redux';

const StreamControlActions = () => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	
	return(
		<div className="w-100  position-absolute left-0 bottom-0 z-2   py-3 px-2 px-md-4 px-lg-5 d-flex justify-content-center align-items-center gap-4     ">
			{/*all controlls*/}
			<div className="d-flex justify-content-start align-items-center gap-2 overflow-auto px-3">
				<span className="bg-danger	">  Reaction</span>  
				<span className="bg-danger	">  Mic</span> 
				<span className="bg-danger	">  Camera</span>
				<span className="bg-danger	">  Speaker</span> 
				<span className="bg-danger	">  Hold</span> 
				
			</div>
			<div>
				{/*live stream end or leave button*/}
				{
					logedUserData?.id === liveStreamData?.publisher?.id
					?
					<span className="bg-danger	">  End	</span> 
					:
					<>
					<span className="bg-danger	"> Leave</span> {/*it end live stream watch from viwer or member side*/} 
					<span className="bg-danger	"> Exit</span> {/*it leave or exit from live as member side but still can watch stream*/} 
					</>
				}
				
			</div>
		</div>
	);

};

export default StreamControlActions;