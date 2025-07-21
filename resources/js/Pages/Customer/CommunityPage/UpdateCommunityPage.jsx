import   {  memo, useEffect, useState, useCallback  }  from 'react'; 
import {   useParams } from 'react-router-dom';  
import { useSelector,useDispatch } from "react-redux"; 
import Spinner from 'react-bootstrap/Spinner'; 

import UpdateCommunityDetailPage from '../../../Components/Customer/CommunityUpdate/UpdateCommunityDetailPage'
import fetchCommunityDetail from './FetchData/fetchCommunityDetail'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)



import {updateCommunityDetailState} from '../../../StoreWrapper/Slice/CommunityDetailSlice';
import {updateCommunityState as updateYourCommunityState} from '../../../StoreWrapper/Slice/YourCommunitySlice';
 

import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';
  
	
const UpdateCommunityPage = () => {
	const { communityId } = useParams(); 
	const communityDetail = useSelector((state) => state.communityDetail);  
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	   
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show  
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [detailLoading, setDetailLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState(communityDetail.communityDetail);
	const [errors, setErrors] = useState({});
	
	//fetch comunity detail is it null or not available
	useEffect(() => {  
		if(communityDetail.communityDetail == null )
		{ 
			fetchCommunityDetail( authToken, dispatch, communityId, setDetailLoading,setFormData )
		}
	},[
		dispatch,
		authToken,
		communityId,
		communityDetail.communityDetail
		]);
	
	 
	
	// Validate form
	const validateForm = () => {
			const newErrors = {};
 
			// Validate text inputs
			// Validate text inputs
			if (!formData.name) newErrors.title = 'Name is required.';
			if (!formData.description) newErrors.description = 'Description is required.'; 

			return newErrors;
	};
	
	
	// Handle form submission
	const handleSubmit = useCallback(async(e) => {
		  e.preventDefault();
			const validationErrors = validateForm();
			if (Object.keys(validationErrors).length > 0) {
				//console.log(validationErrors);
					setErrors(validationErrors);
					setsubmitionMSG( 'Form must be filled and valid');
					setShowModel(true);
							
			} else {
					const source = axios.CancelToken.source(); // Create a cancel token source

					try
					{	  
						setSubmitting(true);//set form submition true
						setErrors({});//set error empty
						 

						const requestData = {
							community_id : formData.id,
							name : formData.name,
							privacy : formData.privacy,
							content_share_access : formData.content_share_access,
							description : formData.description,
						};
					  
							 
						  
						const resultData = await serverConnection('/community/update-detail', requestData, authToken ); 
						  // console.log(resultData);
						if(resultData.status == true)
						{   
						  
							setsubmitionMSG( 'Community  is uploaded successfully');
							
							dispatch(updateCommunityDetailState(
								{ 
									type: 'updateCommunity',
									updatedCommunity: requestData
								}
							));
							dispatch(updateYourCommunityState(
								{ 
									type: 'updateName',
									updatedCommunityNameData : {
										communityId:requestData.community_id,
										name: requestData.name ,
									}
								}
							));
					 
						}
						else
						{ 							  

							setsubmitionMSG('Failed to update the community. Please try again.');
							 
						}   
					} 
					catch (error)
					{
							// console.error(error);
							setsubmitionMSG('An error occurred. Please try again.'); 
							 
						 
					}
					finally{
						setShowModel(true);
						setSubmitting(false);
					}
			 		
					 
			}
	},[authToken,formData, setErrors, setFormData, setSubmitting, setsubmitionMSG, setShowModel]);
	
	  
	
  return (
		<>
			<PageSeo 
				title="Update Community | SkillVilla"
				description="Update your community details on SkillVilla to enhance your group's presence."
				keywords="update community, SkillVilla, community update, edit community"
			/>

      <div className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container">
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				
				{
					submitting && 
					<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<h5 className="no_posts_message"> Your submission is being processed. Please wait a moment. </h5> 
					</div>
				}
				
				 
				{
					 detailLoading && 
					<div className="text-center py-4">
							<Spinner animation="border" size="md" />
					</div>
				}	
				
				{
					!submitting && !detailLoading && formData != null && 
					<div className="  px-2 py-4 p-sm-3 p-md-4 p-lg-5   rounded   sub_main_container    "  >
							 
								 
								<h3 className="pb-2 fw-bold">Update Community</h3>
								 
								<UpdateCommunityDetailPage
									formData={formData}
									setFormData={setFormData}
									errors={errors}
									setErrors={setErrors}
									onSubmit={handleSubmit}
									submitting={submitting}
								/>
							 
							</div>
				}
							
						 
					 
			</div>
		</>
	 );
};

export default memo(UpdateCommunityPage);
