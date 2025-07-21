 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams, useNavigate } from 'react-router-dom';  
import {useSelector,   } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 
import  Image  from 'react-bootstrap/Image'; 

import PostDate from '../../../Components/Customer/Post/PostDate'; 
import ProblemTotalSolution from '../../../Components/Customer/Problem/ProblemTotalSolution';
import ProblemAttachment from '../../../Components/Customer/Problem/ProblemAttachment';
import ProblemUrl from '../../../Components/Customer/Problem/ProblemUrl';
import ProblemSolutionList from '../../../Components/Customer/Problem/ProblemSolutionList';
 
import LargeText from '../../../Components/Common/LargeText';
 import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 
import serverConnection from '../../../CustomHook/serverConnection'; 
 import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 
 

const ProblemDetailPage = () => { 
	const { problem_id } = useParams(); // get id from URL parameter
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [problemDetail, setProblemDetail] = useState(null);
	const [ problemSolutionList, setProblemSolutionList] = useState([]);
	 
	const [loading, setLoading] = useState(false);
	 const navigate = useNavigate(); 
	 
	 
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			setLoading(true);
			if(problem_id == null || authToken == null)
			{
				return;
			}
			let requestData = {id: problem_id, } ;
			let url = `/get-problem-detail`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			//update the post state in redux.
			//console.log(data);
			 
			 if(data != null && data.problemDetail != null )
			 {     
					setProblemDetail(data.problemDetail)
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
	
	 
 	 
	//navigate to user  profile
	const handleNavigateToProfile = useCallback(()=>
	{
			//manageVisitedUrl(`/admin/user-profile/${problemDetail.user.userID}/${problemDetail.user.id}`, 'append');
		navigate(`/admin/user-profile/${problemDetail.user.userID}/${problemDetail.user.id}`);
	},[problemDetail ]);
	  
		
		
	return ( 
		<>
				<PageSeo 
					title={problemDetail?.title ? `${problemDetail.title} | Admin | SkillVilla` : 'Problem Detail | Admin | SkillVilla'}
					description={problemDetail?.title ? `Admin view of the problem titled "${problemDetail.title}" on SkillVilla.` : 'View and manage problem submissions through the admin panel.'}
					keywords={problemDetail?.title ? `admin problem, ${problemDetail.title}, SkillVilla, submitted problem` : 'admin problem, SkillVilla, problem detail, user content'}
				/>

				<div   className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container  " id="mainScrollableDiv"> 
					
					{
						loading ?
							(
								<div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>
							):(
								<div className=" ">
									{
										(problemDetail != null) ?
										(
											<div className=" py-2  py-md-3 py-lg-4 rounded  sub_main_container      ">		
												<div className="px-2  px-md-3 px-lg-4">
													
													{/*Title*/}
													<h2  className="fw-bold p-0 text-break">{problemDetail.title} </h2>
													
													
													
													<div className="d-flex align-items-center flex-wrap gap-2  py-1">
														<div 
															className="d-flex align-items-center  "
															onClick={handleNavigateToProfile}
															style={{cursor:'pointer'}}
														> 
														
															<Image
																src={problemDetail?.user?.customer?.image || '/images/login_icon.png'}
																className="comment_profile_image"
																onError={(event) => handleImageError(event, '/images/login_icon.png')}
																alt={`profile image of ${problemDetail.user.name}`}
																 
															/>
															<span
																 
																title={`View profile of ${problemDetail.user.userID}`}
																className="p-0 px-2 text-decoration-underline post_tags" 
															>
																{problemDetail.user.userID}
															</span>
															
														</div>
							
														<span className="text-secondary px-2 fs-5">|</span>
													 
														<ProblemTotalSolution solutions_count={problemDetail.solutions_count} />
													 
													</div>
						
													 
													
													
													 
													
													{/*Upload date*/}
													
														<PostDate  postDate={problemDetail.created_at_formated}/> 
												</div>
												
												<hr className="border-2  my-5   border-secondary" />
												
												
												{/*description*/}
												<div className="px-2  px-md-3 px-lg-4  ">
															<h4>Description</h4>
															<LargeText largeText={problemDetail.description} />
												</div>
												 
												
												 
												{/*attachment*/}
												{
													problemDetail.attachment != null &&
													<>
														<hr className="border-2  my-5     border-secondary"/>
														<div className="px-2  px-md-3 px-lg-4  ">
															<ProblemAttachment id={problemDetail.id} attachment={problemDetail.attachment}  heading={'Attachment'} component="problemDetail" />
														</div>
													</>
													
												}
												
												
												 
												{/*url*/}
												
												{
													
													problemDetail.url != null &&
													<>
														<hr className="border-2 my-5   border-secondary"/>
														<div className="px-2  px-md-3 px-lg-4 ">
															<ProblemUrl url={problemDetail.url} problem_id={problemDetail.id} title={problemDetail.title}  />
														</div>
													</>
													
												}
												
												{/*Add Problem Solution  */}
														
												<div className="px-2  px-md-3 px-lg-4 py-3">
												
													{/*Problem Solution List*/}  
													<ProblemSolutionList problem_id={problemDetail.id} problemSolutionList={problemSolutionList} setProblemSolutionList={setProblemSolutionList}  handleSolutionDelete={()=>{}} updateProblemSolutionCount={()=>{}} />
												</div>
												 
												 
											</div>
										):
										(
											<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
											<p className="no_posts_message">This Problem is no longer available.</p>
											</div>
										)							
									}
									
								</div>
							)
							
					}	 
				 
					 
					
					 
					 
				</div>
		</>
	);
};

export default memo(ProblemDetailPage);
