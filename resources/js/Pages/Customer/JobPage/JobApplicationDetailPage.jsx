 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams } from 'react-router-dom';  
import {useSelector, useDispatch } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 
 import  Row  from 'react-bootstrap/Row'; 
import  Col  from 'react-bootstrap/Col';  
 
 import JobApplicationHeader from '../../../Components/Customer/CompanyJobApplication/JobApplicationHeader'; 
 import JobApplicationCandidateContact from '../../../Components/Customer/CompanyJobApplication/JobApplicationCandidateContact'; 
 import JobApplicationDetailTestStatusAndScore from '../../../Components/Customer/CompanyJobApplication/JobApplicationDetailTestStatusAndScore'; 
 import JobApplicationDetailApplicationStatus from '../../../Components/Customer/CompanyJobApplication/JobApplicationDetailApplicationStatus'; 
 import JobApplicationCandidateResume from '../../../Components/Customer/CompanyJobApplication/JobApplicationCandidateResume'; 
 import JobApplicationCandidateIntroductionVideo from '../../../Components/Customer/CompanyJobApplication/JobApplicationCandidateIntroductionVideo';
 import JobApplicationAction from '../../../Components/Customer/CompanyJobApplication/JobApplicationAction'; 
 import JobApplicationTestQuestions from '../../../Components/Customer/CompanyJobApplication/JobApplicationTestQuestions'; 
 import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


 
import serverConnection from '../../../CustomHook/serverConnection'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 

 

const JobApplicationDetailPage = () => { 
	const { job_application_id } = useParams(); // get id from URL parameter
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [jobApplicationDetail, setJobApplicationDetail] = useState(null);
	 
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	 

	 
	 
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			 
			setLoading(true);
			if(job_application_id == null || authToken == null)
			{
				return;
			}
			let requestData = {id: job_application_id, } ;
			let url = `/get-job-application-detail`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			 
		 //console.log(data);
			 
			 if(data != null && data.jobApplication != null )
			 {     
					setJobApplicationDetail(data.jobApplication)
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
				title="Application Detail | SkillVilla"
				description="View detailed information about a candidate's job application on SkillVilla."
				keywords="application detail, job application, SkillVilla, candidate profile"
			/>

			<div   className="pt-4   pb-5 px-0 px-md-2 px-lg-3 main_container   " > 
				
				{
					loading ?
						(
							<div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>
						):(
							(jobApplicationDetail != null) ?
							(
							
								<>
									<h3 className="   px-2 pb-4 text-center fw-bold">Job Application Detail </h3>
								
									<Row className=" w-100 m-0 ">
											<Col   xl={jobApplicationDetail.job.test_questions.length > 0 ? 8 : 12} className=" p-0 py-3 py-md-3 py-lg-4 rounded sub_main_container ">
												<div className="   px-2  px-md-3 px-lg-4      ">
													{/*Header that have candiate image with user id and name */}
														<JobApplicationHeader user={jobApplicationDetail.user} />
												</div>	
												
												
												
												{/*test status and score*/}
												{
													jobApplicationDetail.test_attempt != null &&
													<JobApplicationDetailTestStatusAndScore
															testStatus={jobApplicationDetail.test_attempt.status}
															testScore={jobApplicationDetail.test_attempt.score}
													/> 
												}
												
												
												
											
											<div className="  px-2  px-md-3 px-lg-4      ">
												
												{/*application status */}
												<JobApplicationDetailApplicationStatus
															applicationId={jobApplicationDetail.id} 
															applicationStatus={jobApplicationDetail.status} 
															setJobApplicationDetail={setJobApplicationDetail} 
												/>
											 
												
												
												{/* Candidate contact*/}
												<JobApplicationCandidateContact 
													user={jobApplicationDetail.user} 
												/>
												
												{/* Candidate resume*/}
												<JobApplicationCandidateResume 
													applicationId={jobApplicationDetail.id} 
													resume={jobApplicationDetail.resume} 
												/>
												
												{/* Candidate introduction video*/}
												<JobApplicationCandidateIntroductionVideo  
													introductionVideo={jobApplicationDetail.self_introduction} 
												/>
												
												{/*immediate action*/}
												<JobApplicationAction  
													applicationId={jobApplicationDetail.id}
													setJobApplicationDetail={setJobApplicationDetail} 											
												/>
												
												
												
													
													{/*Test Question with answer */}
													{
															jobApplicationDetail.job.test_questions.length > 0 &&
															<div   className="  d-block d-xl-none  py-5  ">
																<JobApplicationTestQuestions 
																	testAttempt={jobApplicationDetail.test_attempt}
																	testQuestions={jobApplicationDetail.job.test_questions} 	
																/>
															</div>
														}
												</div>
										
											</Col>
											{/*Test Question with answer */}
											{
													jobApplicationDetail.job.test_questions.length > 0 &&
													<Col  sx={0} sm={0} xl={4} className="  d-none d-xl-block   m-0">
														<JobApplicationTestQuestions 
															testAttempt={jobApplicationDetail.test_attempt}
															testQuestions={jobApplicationDetail.job.test_questions} 	
														/>
													</Col>
											}
											
									</Row> 
								
								</>
								
							
								 
							):
							(
								<p className="no_posts_message">This job application is no longer available.</p>
							)		
						)
						
				}	 
			  
			</div>
		</>
	);
};

export default memo(JobApplicationDetailPage);
