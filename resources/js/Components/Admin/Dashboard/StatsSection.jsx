 

import   {memo } from 'react';  

import  Row  from 'react-bootstrap/Row';        
import  Col  from 'react-bootstrap/Col';        


import Stats from './Stats/Stats';
const StatsSection = ({totalStats}) => {
 
	 
	  
	return ( 
	 
			<Row className="w-100 m-0 p-0 justify-content-center">
				<Col xm={6} sm={6} md={4}   className="  p-2">
					  
						{
							totalStats != null &&  totalStats.totalUser != null &&
							<Stats heading="Users" total={totalStats.totalUser} style={false} />
						} 
					 
				</Col>
				 <Col xm={6} sm={6} md={4}  className="  p-2">
		 
						{
							totalStats != null &&  totalStats.totalPost != null &&
							<Stats heading="Posts" total={totalStats.totalPost} />
						} 
					 
				</Col>
				<Col xm={6} sm={6} md={4}   className="  p-2">
					 
						{
							totalStats != null &&  totalStats.totalCompany != null &&
							<Stats heading="Companies" total={totalStats.totalCompany}   />
						} 
					 
				</Col>
				<Col xm={6} sm={6} md={4}  className="  p-2">
					 
						{
							totalStats != null &&  totalStats.totalCompanyJob != null &&
							<Stats heading="Jobs" total={totalStats.totalCompanyJob}   />
						} 
					 
				</Col>
				 <Col xm={6} sm={6} md={4}   className="   p-2">
					 
						{
							totalStats != null &&  totalStats.totalFreelance != null &&
							<Stats heading="Freelance" total={totalStats.totalFreelance}    />
						} 
					 
				</Col>
				 <Col xm={6} sm={6} md={4}   className="  p-2">
					 
						{
							totalStats != null &&  totalStats.totalCommunity != null &&
							<Stats heading="Communities" total={totalStats.totalCommunity}    />
						} 
					 
				</Col>
				 <Col xm={6} sm={6} md={4}   className="  p-2">
					 
						{
							totalStats != null &&  totalStats.totalWorkfolio != null &&
							<Stats heading="Workfolio" total={totalStats.totalWorkfolio}    />
						} 
					 
				</Col>
				 <Col xm={6} sm={6} md={4}   className="  p-2   ">
					 
						{
							totalStats != null &&  totalStats.totalProblem != null &&
							<Stats heading="Problem" total={totalStats.totalProblem}   />
						} 
					 
				</Col>
				 <Col xm={6} sm={6} md={4}   className=" p-2">
					 
						{
							totalStats != null &&  totalStats.totalStories != null &&
							<Stats heading="Stories" total={totalStats.totalStories}   />
						} 
					 
				</Col>
				 
				
				
			</Row>
	);
	
};

export default memo(StatsSection);
