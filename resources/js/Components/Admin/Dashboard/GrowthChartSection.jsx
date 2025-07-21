 

import   {memo,   } from 'react';  

import  Row  from 'react-bootstrap/Row';        
import  Col  from 'react-bootstrap/Col';        

import DailyGrowthChart from './DailyGrowthChart/DailyGrowthChart'; 
import YearlyGrowthChart from './YearlyGrowthChart/YearlyGrowthChart'; 

const GrowthChartSection = ({
	yearlyGrowth,
	dailyGrowth,
	setYearlyGrowth,
	setDailyGrowth,
}) => {
   
	return ( 
	 
			<Row className="w-100 m-0 p-0 justify-content-center">
				<Col xm={12} sm={12} lg={6}    className="   p-2">
					{
						dailyGrowth != null && 
						<DailyGrowthChart 
							dailyGrowth={dailyGrowth}
							setDailyGrowth={setDailyGrowth} 
					 /> 
					}
					
					 
				 
				</Col>
				 <Col xm={12} sm={12} lg={6}  className="  p-2">
					{
						yearlyGrowth != null && 
						<YearlyGrowthChart 
							yearlyGrowth={yearlyGrowth}
							setYearlyGrowth={setYearlyGrowth} 
					 /> 
					}
				</Col>
 
				
			</Row>
	);
	
};

export default memo(GrowthChartSection);
