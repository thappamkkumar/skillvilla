 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams } from 'react-router-dom';  
import {useSelector,   } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 
import  Row  from 'react-bootstrap/Row'; 
import  Col  from 'react-bootstrap/Col';  
 
import JobHeader from '../../../Components/Customer/CompanyJob/JobHeader';
 import JobCompanyAndUser from '../../../Components/Admin/Job/JobCompanyAndUser';
 import JobDetailInfo from '../../../Components/Customer/CompanyJob/JobDetailInfo';
import JobDetailContact from '../../../Components/Customer/CompanyJob/JobDetailContact';
import JobSkillRequired from '../../../Components/Customer/CompanyJob/JobSkillRequired';
import JobTestQuestions from '../../../Components/Customer/CompanyJob/JobTestQuestions';
 
import LargeText from '../../../Components/Common/LargeText';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import serverConnection from '../../../CustomHook/serverConnection';   

import useJobDeleteWebsocket from '../../../Websockets/Job/useJobDeleteWebsocket'; 
import useJobApplicationCountWebsocket from '../../../Websockets/Job/useJobApplicationCountWebsocket'; 

 
 

const JobDetailPage = () => { 
	const { job_id } = useParams(); // get job_id from URL parameter
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [jobDetail, setJobDetail] = useState(null);
	const [jobTestQuestions, setJobTestQuestions] = useState([]);
	 
	const [loading, setLoading] = useState(false);
 
	 
	// Call the useJobWebsockets hook for websockets event listeners 
	useJobDeleteWebsocket( loggedUserData, job_id, setJobDetail );
	useJobApplicationCountWebsocket( loggedUserData, job_id, setJobDetail );
		
	 
	const updateJobDetailSave = useCallback((savedJobData)=>{
	 setJobDetail((pre)=>({...pre,has_saved:savedJobData.has_saved}));
	},[]);
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			setLoading(true);
			if(job_id == null || authToken==null)
			{
				return;
			}
			let requestData = {job_id: job_id, } ;
			let url = `/get-job-vacancy-detail`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			 //console.log(data);
			 
			 if(data != null && data.jobDetail != null )
			 {     
					setJobDetail(data.jobDetail)
					if(data.testQuestions != null && data.testQuestions.length > 0)
					{
						setJobTestQuestions(data.testQuestions);
					}
			 } 
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[ authToken]); 

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
			apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken]);
	
	 
 	 
	 
	 
	return ( 
		<>
			<PageSeo 
				title={jobDetail?.title ? `${jobDetail.title} | Admin | SkillVilla` : 'Job Detail | Admin | SkillVilla'}
				description={jobDetail?.title ? `Admin view of the job titled "${jobDetail.title}" on SkillVilla.` : 'View and moderate job postings through the SkillVilla admin panel.'}
				keywords={jobDetail?.title ? `admin job, ${jobDetail.title}, SkillVilla, job listing` : 'admin job, SkillVilla, job detail, job moderation'}
			/>

			<div   className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container  " id="mainScrollableDiv"> 
			
			 
				{
					loading ?
					(
						<div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>
					):(
						<div className="">
							{
								(jobDetail != null) ?
								(
										<Row className=" w-100 m-0 ">
											<Col   xl={loggedUserData.id === jobDetail.user_id && jobTestQuestions.length > 0 ? 8 : 10} className="py-3  py-md-3 py-lg-4 px-2  px-md-3 px-lg-4  mx-auto rounded sub_main_container ">
												<JobHeader 
													title={jobDetail.title}
													user_id={jobDetail.user_id}
													job_id={jobDetail.id}
													detail={true}
													setJobDetail={setJobDetail}
												/>      
												  
												 
												<JobCompanyAndUser job_id={jobDetail.id} company={jobDetail.company} user={jobDetail.user || null}/>
												
												 
												<JobDetailInfo jobDetail={jobDetail} />
				
												<hr className="border-2  my-5   border-secondary" />
											
												
												<>
													<h4>Required Skills</h4>
													<JobSkillRequired skillRequired={jobDetail.skill_required} />
												</>
												
												<hr className="border-2  my-5   border-secondary" />
												
												
												<div>
													<h4>Description</h4>
													<LargeText largeText={jobDetail.description} />
												</div>
											 
												 
												<hr className="border-2  my-5   border-secondary" />
												
												<JobDetailContact jobDetail={jobDetail}/>
												 
												 
												
												{
													loggedUserData.id == jobDetail.user_id && 
													jobTestQuestions.length > 0 &&
													<div   className="  d-block d-xl-none   ">
														<hr className="border-2  my-5   border-secondary" />
												
														<h4>About Test </h4>
														<JobTestQuestions 
															job_id={jobDetail.id}
															time_limit={jobDetail.time_limit} 
															testQuestions={jobTestQuestions}
															setJobDetail={setJobDetail}
															/>
													</div>
												}
											
											</Col>
											{
													loggedUserData.id == jobDetail.user_id && 
													jobTestQuestions.length > 0 &&
													<Col  sx={0} sm={0} xl={4} className="  d-none d-xl-block   m-0">
														
														<JobTestQuestions 
															job_id={jobDetail.id}
															time_limit={jobDetail.time_limit} 
															testQuestions={jobTestQuestions}
															setJobDetail={setJobDetail}
															/>
													</Col>
											}
										</Row>  
									 
								):
								(
									<p className="no_posts_message">This job is no longer available.</p>
								)		
							}
						</div>
					 
					)
				
				}	 
			</div>
		</>
	);
};

export default memo(JobDetailPage);
