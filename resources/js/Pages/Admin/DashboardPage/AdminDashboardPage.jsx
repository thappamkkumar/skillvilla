 

import   {memo, useEffect, useCallback, useState, useRef } from 'react';  
import {useSelector, useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner';        

import StatsSection from '../../../Components/Admin/Dashboard/StatsSection';
import GrowthChartSection from '../../../Components/Admin/Dashboard/GrowthChartSection';
 import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import serverConnection from '../../../CustomHook/serverConnection';
 
const AdminDashboardPage = ( ) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 
	const [totalStats, setTotalStats] = useState(null); 
	const [yearlyGrowth, setYearlyGrowth] = useState(null); 
	const [dailyGrowth, setDailyGrowth] = useState(null); 
	const [loading, setLoading] = useState(false);
	 
	 const apiCall = useCallback( async () => {
    try {
			if(authToken == null){return}
			setLoading(true);
       
			
			const resultData = await serverConnection('/admin/get-dashboard-info', {}, authToken); 
      
			//console.log(resultData);
			if( resultData != null &&  resultData.status == true )
			{
				if(resultData.totalStats)
				{
					setTotalStats(resultData.totalStats);
				}
				
				if(resultData.yearlyGrowth)
				{
					setYearlyGrowth(resultData.yearlyGrowth);
				}
				
				if(resultData.dailyGrowth)
				{
					setDailyGrowth(resultData.dailyGrowth);
				}
				
			}
        
       
    } catch (error) {
      console.error(error);
			 
    }
		finally
		{
			setLoading(false); 
		}
  },[authToken,  ]);
	
	//call api to check the  user has register company or not
	useEffect(() => {
 

  apiCall();
}, [authToken]); 
	
	 
	  
	return ( 
		<>
			<PageSeo 
				title="Admin Dashboard | SkillVilla"
				description="Access administrative tools and analytics for managing SkillVilla users, content, and platform settings."
				keywords="admin dashboard, SkillVilla admin, platform management, analytics"
			/>

			<div className="   pt-0    pb-5 px-1 px-md-2 px-lg-3 main_container  "> 
				{
					loading ?
					(
						<div className="text-center">
							<Spinner size="md" />
						</div>
					):(
					
						<>
							
							<h3 
							className="sub_main_container p-2  p-md-3 rounded"
							>
							<strong>DashBoard </strong>
							</h3>
						
							{/*Stats of total of all*/} 
							{
								totalStats != null &&  
								<div className="    py-3  " >
								<StatsSection totalStats={totalStats} />
								</div>
							}
							
							
							 
								<GrowthChartSection  
								yearlyGrowth={yearlyGrowth}
								dailyGrowth={dailyGrowth}
								setYearlyGrowth={setYearlyGrowth}
								setDailyGrowth={setDailyGrowth}
								/>
								 
							 
						</>
					
					)
				}
				 
				
			</div>
		</>
	);
	
};

export default memo(AdminDashboardPage);
