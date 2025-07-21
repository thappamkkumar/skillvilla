 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams } from 'react-router-dom';  
import {useSelector, useDispatch } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 

import PostDate from '../../../Components/Customer/Post/PostDate'; 
 import ProblemHeader from '../../../Components/Customer/Problem/ProblemHeader';
 import ProblemTotalSolution from '../../../Components/Customer/Problem/ProblemTotalSolution';
import WorkfolioUploadBy from '../../../Components/Customer/Workfolio/WorkfolioUploadBy';
 import ProblemAttachment from '../../../Components/Customer/Problem/ProblemAttachment';
import ProblemUrl from '../../../Components/Customer/Problem/ProblemUrl';
import ProblemSolutionList from '../../../Components/Customer/Problem/ProblemSolutionList';
import AddProblemSolution from '../../../Components/Customer/Problem/AddProblemSolution';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)
 
import LargeText from '../../../Components/Common/LargeText';
  
 
import serverConnection from '../../../CustomHook/serverConnection'; 

import useProblemDeleteWebsocket from '../../../Websockets/Problem/useProblemDeleteWebsocket'; 
import useProblemSolutionCountWebsocket from '../../../Websockets/Problem/useProblemSolutionCountWebsocket'; 
import useAddNewProblemSolutionWebsocket from '../../../Websockets/Problem/useAddNewProblemSolutionWebsocket'; 
import useProblemSolutionDeleteWebsocket from '../../../Websockets/Problem/useProblemSolutionDeleteWebsocket'; 

 

const ProblemDetailPage = () => { 
	const { problem_id } = useParams(); // get id from URL parameter
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [problemDetail, setProblemDetail] = useState(null);
	const [ problemSolutionList, setProblemSolutionList] = useState([]);
	 
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	//function to update problem solution count
	const updateProblemSolutionCount = useCallback((count)=>{
		  
		setProblemDetail((prevState) => ({
				...prevState, // Spread previous state to keep other properties
 
				solutions_count: count.solutions_count
			}));
		
	},[]);
	
	//function to update state when solution deleted
	const handleSolutionDelete = useCallback((solution_id)=>{
		setProblemSolutionList((prevList) =>
							prevList.map((solution) =>
								solution.id === solution_id ?  { id: solution.id, deleted: true } : solution
							)
						);
		
	}, []);
	 
/// Call the useProblemDetailWebsockets hook for websockets event listeners
    
	useProblemDeleteWebsocket(loggedUserData, problem_id, setProblemDetail);
	useProblemSolutionCountWebsocket(loggedUserData, problem_id, updateProblemSolutionCount);
	useAddNewProblemSolutionWebsocket(loggedUserData, problem_id, setProblemSolutionList);
	useProblemSolutionDeleteWebsocket(loggedUserData, problem_id, handleSolutionDelete);
	 
	 
	
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
	
	 
 	 
	 
	 
	return ( 
		<>
			<PageSeo
				title={problemDetail?.title ? `${problemDetail.title} | Problem Detail | SkillVilla` : 'Problem Detail | SkillVilla'}
				description={problemDetail?.title ? `Learn more about the problem titled "${problemDetail.title}" on SkillVilla.` : 'Explore detailed problems from professionals on SkillVilla.'}
				keywords={problemDetail?.title ? `problem detail, ${problemDetail.title}, SkillVilla, professional problem` : 'problem detail, SkillVilla, user content, shared problem'}
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
												
												<ProblemHeader title={problemDetail.title} problem_id={problemDetail.id} user_id={problemDetail.user.id} has_saved={problemDetail.has_saved} detail={true} setProblemDetail={setProblemDetail}  />
												
												
												<div className="d-flex align-items-center flex-wrap gap-2  py-1">
													<WorkfolioUploadBy 
													user={problemDetail.user} 
												
													/>
						
													<span className="text-secondary px-2 fs-5">|</span>
												 
													<ProblemTotalSolution solutions_count={problemDetail.solutions_count} />
												 
												</div>
					
												 
												
												
												 
												
												{/*Upload date*/}
												
													<PostDate  postDate={problemDetail.created_at_human_readable}/> 
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
											<hr className="border-2  mt-5 mb-0  border-secondary" />
																				 
											<AddProblemSolution problem_id={problemDetail.id} setProblemSolutionList ={setProblemSolutionList} updateProblemSolutionCount={updateProblemSolutionCount} />
												
											<div className="px-2  px-md-3 px-lg-4 py-3">
											
												{/*Problem Solution List*/}  
												<ProblemSolutionList problem_id={problemDetail.id} problemSolutionList={problemSolutionList} setProblemSolutionList={setProblemSolutionList}  handleSolutionDelete={handleSolutionDelete} updateProblemSolutionCount={updateProblemSolutionCount} />
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
	 
		 
				{/*component for share post with user or community or copy link*/}
				<Share /> 
		 
			</div>
		</>
	);
};

export default memo(ProblemDetailPage);
