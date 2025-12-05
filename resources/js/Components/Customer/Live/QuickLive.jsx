import { memo, useState, useCallback } from 'react';
import {useSelector , useDispatch } from 'react-redux';  
import Image from 'react-bootstrap/Image';
import Button from "react-bootstrap/Button";

import handleImageError from '../../../CustomHook/handleImageError';
import serverConnection from '../../../CustomHook/serverConnection';

import {updateLiveStreamState} from '../../../StoreWrapper/Slice/LiveStreamSlice';

const QuickLive = ({ live }) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store 
	const liveStreamData = useSelector((state) => state.liveStreamData); //selecting token from store 
	const [submitting, setSubmitting] = useState(null);
	const dispatch = useDispatch(); 

  const handleJoinLiveStream = useCallback(async() => {
    if(!authToken)
		{
			return;
		}
		try
		{
			setSubmitting(true);
			
			//call api to create quick live stream
			const result = await serverConnection('/live-stream-new-viewer', {liveId: live.id}, authToken);
			
			//console.log(result);
			 
			
			if(result?.status == true)
			{		 
		
				const messages =  result.messages;
				const viewerData =  result.viewer;
				const data = {
					viewer: viewerData,
					liveId: live.id,
					publisherId: result.publisher_id,
					startedAt: live.quick_stream.started_at,
					messages: messages,
				};
				dispatch(updateLiveStreamState(
					{ 
					'type':'viewerStartWatchingStream',  
					'data': data
					}
				));
			}
			else
			{
				//setsubmitionMSG(result?.message || 'Failed to create quick live stream. Please try again.');
				//setShowModel(true);
			}
		}
		catch(e)
		{
			//setsubmitionMSG('An error occurred. Please try again.');
			console.log('error:- ' + e);
			//setShowModel(true);
		}
		finally
		{ 
			setSubmitting(false);
		}
			
			
			
  }, [authToken]);

  return (
	
		<Button 
			variant="light"
			id={`quickLive${live.id}`}
			title={`Go live with ${live?.publisher?.name || "Unknown User"}`}
			className="w-100 px-2 py-2 d-flex flex-wrap align-items-center   "
			onClick={handleJoinLiveStream}
			disabled={liveStreamData.liveStatus !== 'idle'}
		>
     
      {/* IMAGE */}
      <div className="btn p-0 border-0">
        <Image
          src={live?.publisher?.customer?.image || "/images/login_icon.png"}
          className="profile_img"
          alt={`profile image of ${live?.publisher?.userID || "user"}`}
          onError={(e) => handleImageError(e, "/images/login_icon.png")}
        />
      </div>

      {/* TEXT Only on XL+ */}
      <div className="d-none d-xl-flex flex-column ms-2 text-start "  >
        <strong
          className="text-truncate overflow-hidden text-nowrap userCard_userName"
        >
          {live?.publisher?.name || "Unknown User"}
        </strong>

        <small
          className=" text-truncate overflow-hidden text-nowrap userCard_userID"
        >
          {live?.created_at_human_readable || ""}
        </small>
      </div>
    </Button>
  );
};

export default memo(QuickLive);
