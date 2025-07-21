// resources/js/components/Others/Loading.jsx

import React from 'react';
import { Container, Spinner } from 'react-bootstrap';   

const Login = () => 
{
	 
	return (
			<Container className="  d-flex justify-content-center align-items-center   " style={{  position:'fixed', width:'100%', height:'100vh'}}  fluid>
				<Spinner className="mx-1   " animation="grow" style={{ animationDelay:'0s', animationDuration:'2s', color:'rgba(0,0,0,1)', animationTimingFunction:'ease-in-out', animationFillMode:'forwards'}}  size="sm" />
				
				<Spinner className="mx-1 " animation="grow" style={{ animationDelay:'0.2s', animationDuration:'2s', color:'rgba(0,0,0,1)', animationTimingFunction:'ease-in-out', animationFillMode:'forwards'}}  size="sm" />
				
				<Spinner className="mx-1 " animation="grow" style={{ animationDelay:'0.4s', animationDuration:'2s', color:'rgba(0,0,0,1)', animationTimingFunction:'ease-in-out', animationFillMode: 'forwards'}}  size="sm" />
				
				<Spinner className="mx-1 " animation="grow" style={{ animationDelay:'0.6s', animationDuration:'2s', color:'rgba(0,0,0,1)', animationTimingFunction:'ease-in-out', animationFillMode:'forwards'}}  size="sm" />
				
				<Spinner className="mx-1 " animation="grow" style={{ animationDelay:'0.8s', animationDuration:'2s', color:'rgba(0,0,0,1)', animationTimingFunction:'ease-in-out', animationFillMode:'forwards'}}  size="sm" />
				
				<Spinner className="mx-1 " animation="grow" style={{ animationDelay:'1s', animationDuration:'2s', color:'rgba(0,0,0,1)' ,animationTimingFunction:'ease-in-out', animationFillMode:'forwards'}}  size="sm" />
				
				<Spinner className="mx-1 " animation="grow" style={{ animationDelay:'1.2s', animationDuration:'2s', color:'rgba(0,0,0,1)', animationTimingFunction:'ease-in-out', animationFillMode:'forwards'}}  size="sm" />
			
				<Spinner className="mx-1 " animation="grow" style={{ animationDelay:'1.4s', animationDuration:'2s', color:'rgba(0,0,0,1)', animationTimingFunction:'ease-in-out', animationFillMode:'forwards'}}  size="sm" />
				
				<Spinner className="mx-1 " animation="grow" style={{ animationDelay:'1.6s', animationDuration:'2s', color:'rgba(0,0,0,1)', animationTimingFunction:'ease-in-out', animationFillMode:'forwards' }}  size="sm" />
			</Container >
	);
};

export default Login;
