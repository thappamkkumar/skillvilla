 
import  {useState, useEffect, useCallback, } from 'react'; 
import {useParams } from 'react-router-dom';   
import {useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';   
import Row from 'react-bootstrap/Row';  
import Col from 'react-bootstrap/Col';  

import StoryDetailHeader from '../../../Components/Customer/Stories/StoryDetailHeader';
import StoryDetail from '../../../Components/Customer/Stories/StoryDetail';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)



import serverConnection from '../../../CustomHook/serverConnection'; 

import useStoriesDetailWebsockets from './Stories/useStoriesDetailWebsockets';
import useStoriesWebsockets from './Stories/useStoriesWebsockets';

const StoriesDetailPage = ( ) => { 

	const { user_id } = useParams(); // get id from URL parameter
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
 	const [loading, setLoading] = useState(false);
 	const [userData, setUserData] = useState({});
 	const [stories, setStories] = useState([]);
 	const [index, setIndex] = useState(0);
	 
	  
	 //delete story	 
	const deleteStory = useCallback(( story_user_id, story_id)=>{ 
		if(userData.id != story_user_id)
		{ 
			return;
		}
	 	setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === story_id ? { ...story, deleted: true } : story
      )
    );
	},[setStories, userData]);	

	const addNewStory = useCallback((newStory)=>{ 
	 	if(userData.id != newStory.user_id)
		{
			return;
		}
	 	setStories((prevStories) =>([
				...prevStories,
				newStory  
			])
    );
	},[setStories, userData]);		
	
	// Call the useStoriesDetailWebsockets hook for websockets event listeners 
	useStoriesDetailWebsockets(
		deleteStory,
		addNewStory
	);
	// Call the useStoriesWebsockets hook for websockets event listeners 
	 useStoriesWebsockets();
	
	
	
	//function for fetching data or stories of following user 
	const apiCall = useCallback(async()=>{ 
		try
		{
			if(user_id == null || authToken==null)
			{
				return;
			}
			setLoading(true);
			let userData = {user_id:user_id};
			let url = '/get-story-detail';
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			 //console.log(data);

			if(data != null && data.status == true && data.storyDetail != null  )
			{
				 const userDetails = data.storyDetail;
				const userStories = userDetails.stories;

				setUserData({
						id: userDetails.id,
						name: userDetails.name,
						userID: userDetails.userID,
						customer: userDetails.customer,
				});

				setStories(userStories);
			}
			 setLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoading(false);
		}
			
	},[ user_id, authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [ user_id, authToken]);
	 
	
	  	 
	
	if(loading)
	{
			return ( 
				<div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>
			);
	}
	if(!loading && stories.length <= 0)
	{
			return ( 
				<div className="w-100   py-4">
					<p className="no_posts_message post  ">Story is no longer available.</p>
				</div>
			);
	}

	 
	return (  
		<>
			<PageSeo 
					title={userData?.name ? `${userData.name}'s Story | SkillVilla` : 'Story Detail | SkillVilla'}
					description={userData?.name ? `Read ${userData.name}'s story and get inspired by their journey on SkillVilla.` : 'Explore detailed stories from professionals on SkillVilla.'}
					keywords={userData?.name ? `story, ${userData.name}, SkillVilla, professional story` : 'story detail, SkillVilla, user journey, professional experience'}
			/>

			<div  className="pb-5 py-3 main_container   " id="mainScrollableDiv" >
				 
					<Row className="mx-auto   w-100   px-2   px-sm-3 px-md-4 px-lg-5      ">
						<Col sm={12} xl={10} xxl={8} className="mx-auto   p-0 rounded   sub_main_container"> 
							 
								<StoryDetailHeader 
									index={index} 
									userData={userData}
									createAt={stories[index].created_at_human_readable} 
									storyID={stories[index].id} 
									deleteStory={deleteStory}
									{...(stories[index].deleted != null && stories[index].deleted == true && { storyDeleted: true })}
								/>	

								<StoryDetail 
									stories={stories} 
									setStories={setStories} 
									index={index} 
									setIndex={setIndex} 

								/>
												 
								 
						</Col>
					</Row> 
					
				{/*component for share post with user or community or copy link*/}
				<Share />
			</div>
		</>  
	);
	
};

export default StoriesDetailPage;
