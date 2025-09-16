 

import   {memo,useCallback, useState } from 'react';   

import {useSelector , useDispatch } from 'react-redux';  

import Button from 'react-bootstrap/Button';   
import Spinner from 'react-bootstrap/Spinner';   

import { BsBroadcast } from "react-icons/bs";

import serverConnection from '../../../CustomHook/serverConnection';


const QuickLiveStream = ({
	setShowModel,
	setsubmitionMSG,
}) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store 
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
			console.log(result);
			if(result?.status == true)
			{
				setsubmitionMSG("Live stated.");
			}
			else
			{
				setsubmitionMSG(result?.message || 'Failed to create quick live stream. Please try again.');
			}
			
			
		}
		catch(e)
		{
			setsubmitionMSG('An error occurred. Please try again.');
			console.log('error:- ' + e);
		}
		finally
		{
			setShowModel(true);
			setSubmitting(false);
		}
		
	}, [authToken, dispatch]);

 
	return ( 
		   
			 	 
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
			 
				 
	);
	
};

export default memo(QuickLiveStream);
