import {useEffect, useState, useCallback, useRef, memo }  from 'react';  
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"; 
  
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Spinner from 'react-bootstrap/Spinner'; 
   
 import CommunityDetailHeaderSection1 from '../../../Components/Admin/Community/CommunityDetailHeaderSection1';
import CommunityDetailHeaderSection2 from '../../../Components/Admin/Community/CommunityDetailHeaderSection2'; 

import LargeText from '../../../Components/Common/LargeText';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 
import serverConnection from '../../../CustomHook/serverConnection'; 

const CommunityDetailPage = () => {
	const { communityId } = useParams(); 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
 	
	
	
	// Local state 
   const [communityDetail, setCommunityDetail] = useState(null);
   const [loading, setLoading] = useState(false);
   
	 
   
	//function for fetching data
	const apiCall = useCallback(async( )=>{ 
		try
		{
			if(authToken == null || communityId == null){return;}
			setLoading(true); 
			  
			//call the function fetch  data fron server
			let data = await serverConnection('/admin/community-detail', {communityId: communityId}, authToken);
			  
		   //console.log(data);
			if(data != null && data.status == true )
			{
				setCommunityDetail(data.communityDetail || null);
			}
			 
		}
		catch(error)
		{
			 //console.log(error);
			
		}
		finally
		{
			setLoading(false);
		}
			
	},[  authToken, communityId]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
			apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [ authToken]);
	
	 
       

 
		  
	 
	 
	 
	if(loading)
	{
		return(
		<div className="text-center py-4">
							<Spinner animation="border" size="md" />
						</div>
		);
	}
	
	 
	if(communityDetail == null && !loading)
	{
		return(
		<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<p className="no_posts_message   ">
			Community is not found or deleted. </p>
		</div>
		);
	}
	 
  return (
		<>
			<PageSeo 
				title={communityDetail?.name ? `${communityDetail.name} | Admin | SkillVilla` : 'Community Detail | Admin | SkillVilla'}
				description={communityDetail?.name ? `Admin view of "${communityDetail.name}" community on SkillVilla.` : 'View detailed information about a community in the admin panel.'}
				keywords={communityDetail?.name ? `admin community, ${communityDetail.name}, SkillVilla, manage community` : 'admin community, SkillVilla, community detail, admin view'}
			/>

			<Row className="w-100 m-auto p-0 pt-3 pt-md-5">
				<Col xs={12} sm={12} md={10} lg={10} xl={8}
				className="px-2 px-md-4 px-lg-5 mx-auto  ">
				 
				  
					 
					{		communityDetail != null && !loading
							&&
							<>
								 
											{/*it render community name, image and   total members and total request  */}
										<CommunityDetailHeaderSection1 
											communityDetail={communityDetail}  
										/> 
										
										<hr className="my-4"/>
										
										{/*it render privacy and content share access*/}
										<CommunityDetailHeaderSection2 
											communityDetail={communityDetail}  
										/> 
			
										{/*description*/}
									 <div className=" my-4  ">
												<h4>Description</h4>
												<LargeText largeText={communityDetail.description} />
										</div>
				
							</>
							
						 
				 }	
					
					
					
				</Col>
				
			
			</Row>
		</>
			  
  );
};

export default memo(CommunityDetailPage);
