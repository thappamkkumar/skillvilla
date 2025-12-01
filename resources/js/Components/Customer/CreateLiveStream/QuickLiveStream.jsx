 

import   {memo,useCallback, useState } from 'react';   

import {useSelector , useDispatch } from 'react-redux';  

import Button from 'react-bootstrap/Button';   
import Spinner from 'react-bootstrap/Spinner';   
import { Card,   Badge } from "react-bootstrap";



import { BsBroadcast } from "react-icons/bs";

import serverConnection from '../../../CustomHook/serverConnection';

import {updateLiveStreamState} from '../../../StoreWrapper/Slice/LiveStreamSlice';

const QuickLiveStream = ({
	setShowModel,
	setsubmitionMSG,
}) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store 
	const liveStreamData = useSelector((state) => state.liveStreamData); //selecting token from store 
	const [submitting, setSubmitting] = useState(null);
	const dispatch = useDispatch(); 
	
	   
	//function go for quick live  
	const goQuickLive = useCallback(async()=>{
		if(!authToken)
		{
			return;
		}
		try
		{
			setSubmitting(true);
			
			//call api to create quick live stream
			
			const result = await serverConnection('/quick-live-stream-start', [], authToken);
			// console.log(result);
			
			if(result?.status == true)
			{
				const liveStreamData =  result.data.live_stream;
				
				dispatch(updateLiveStreamState(
					{ 
					'type':'liveStreamStart',  
					'data': liveStreamData
					}
				));
				
				 
			}
			else
			{
				setsubmitionMSG(result?.message || 'Failed to create quick live stream. Please try again.');
				setShowModel(true);
			}
			
			
		}
		catch(e)
		{
			setsubmitionMSG('An error occurred. Please try again.');
			console.log('error:- ' + e);
			setShowModel(true);
		}
		finally
		{ 
			setSubmitting(false);
		}
		
	}, [authToken, dispatch]);

 
	/*return ( 
		    
				<div className="w-100 h-auto clearfix">
					<Button 
						variant="dark"
						title="Go Live Quickly."
						id="goQuickLive"
						className="float-end "
						onClick={goQuickLive}
						disabled={submitting}
					>
						{
							submitting ? <Spinner  className="me-2 " size="sm" /> : <BsBroadcast className="me-2 "/>
						}
						 Quick Live
					</Button>
				</div>
			 
				 
	);*/
	
	
	
	
	return (
    <div className=" ">
          <Card className="  border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                 
                <Card.Title className="m-0 fs-3 fw-bold">Quick Stream</Card.Title>
              </div>

              <Card.Text className="text-muted">
                Go live instantly with a single click. Perfect for quick, casual broadcasts.
              </Card.Text>

              <Button 
									variant="dark"
									title="Go Live Quickly."
									id="goQuickLive" 
									onClick={goQuickLive}
									disabled={submitting}
								>
									{
										submitting ? <Spinner  className="me-2 " size="sm" /> : <BsBroadcast className="me-2 "/>
									}
									 Go Live
								</Button>
            </Card.Body>
          </Card>
         

        {/* Professional Stream (Coming Soon) */}
           <Card className="  h-100 border-0">
            <Card.Body className="opacity-75">
              <div className="d-flex align-items-center mb-2">
                
                <Card.Title className="m-0 fs-3 fw-bold">Professional Stream</Card.Title>
              </div>

              <Card.Text className="text-muted">
                Advanced streaming with multiple sessions and full broadcast control.
              </Card.Text>

              <Badge bg="secondary">Coming Soon</Badge>
            </Card.Body>
          </Card>
        
    </div>
  );
	
};

export default memo(QuickLiveStream);
