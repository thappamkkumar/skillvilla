 
import   {useEffect, useState, useCallback  }  from 'react';  
import {useDispatch, useSelector } from 'react-redux';  
import {  useParams } from 'react-router-dom';  
      

import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import FreelanceBidsPageHeader from '../../../Components/Customer/FreelanceBidList/FreelanceBidsPageHeader'; 
import FreelanceBidList from '../../../Components/Customer/FreelanceBidList/FreelanceBidList'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import {updateFreelanceBidState} from '../../../StoreWrapper/Slice/FreelanceBidSlice';
 
import serverConnection from '../../../CustomHook/serverConnection'; 
 
import useAddNewFreelanceBidWebsocket from '../../../Websockets/Freelance/useAddNewFreelanceBidWebsocket'; 
import useFreelanceBidCountWebsocket from '../../../Websockets/Freelance/useFreelanceBidCountWebsocket'; 
 




const FreelanceBidsPage = () => { 
	const { freelance_id } = useParams(); // get job_id from URL parameter
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const freelanceBidList = useSelector((state) => state.freelanceBidList); //selecting post List from store
	 
	const [loading, setLoading] = useState(false);
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	 // Call the   hook for websockets event listeners
	 useAddNewFreelanceBidWebsocket(freelance_id);
	 useFreelanceBidCountWebsocket(logedUserData);
		   
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			if(freelance_id == null || authToken==null){return;}
			let requestdata = {
					freelance_id: freelance_id,
					has_freelance: Object.keys(freelanceBidList.freelanceData).length === 0
			};

			let url = `/get-freelance-bids?cursor=${freelanceBidList.cursor}`;
			  
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url, requestdata, authToken);
			 
			  //console.log(data);
			if(data != null && data.status == true )
			{
				if(data.freelance != null)
				{ 
					dispatch(updateFreelanceBidState({type : 'SetFreelanceData', freelanceData: data.freelance}));
					
				}
				 if(data.freelanceBidList.data.length != 0 )
				 { 
						dispatch(updateFreelanceBidState({type :'SetFreelanceBid', freelanceBidList: data.freelanceBidList.data}));
					} 
					dispatch(updateFreelanceBidState({type :'SetCursor', cursor: data.freelanceBidList.next_cursor})); 
					dispatch(updateFreelanceBidState({type : 'SetHasMore', hasMore: data.freelanceBidList.next_cursor != null})); 
				 
			}
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[dispatch, freelanceBidList, authToken]); 

	useEffect(() => { 
		 // Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(freelanceBidList.freelanceBidList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [freelanceBidList.freelanceBidList, authToken]);
	
	  
	 
       
 	 
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateFreelanceBidState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
 
	return ( 
		<>
			<PageSeo 
			title={freelanceBidList?.freelanceData?.title ? `Bids for "${freelanceBidList.freelanceData.title}" | SkillVilla` : 'Freelance Bid History | SkillVilla'}
			description={freelanceBidList?.freelanceData?.title ? `View all bids submitted for "${freelanceBidList.freelanceData.title}" on SkillVilla.` : 'Check your freelance gig’s bid history on SkillVilla.'}
			keywords={freelanceBidList?.freelanceData?.title ? `bid history, ${freelanceBidList.freelanceData.title}, freelance bids, SkillVilla` : 'freelance bid history, SkillVilla, proposal tracking'}
		/>


			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={freelanceBidList.hasMore}
				loading={loading}
				initialScrollPosition={freelanceBidList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
			>
				<div className="px-2   px-sm-3 px-md-4 px-lg-5  py-2 ">
				
					{ 
						(freelanceBidList.freelanceData != null && Object.keys(freelanceBidList.freelanceData).length !== 0)&&
						(<FreelanceBidsPageHeader freelanceData={freelanceBidList.freelanceData}/>)
					}
				
					{
						(freelanceBidList.freelanceBidList.length <= 0 && !loading)
						?(
								<p className="no_posts_message  mt-3 ">Thier is no bid on this freelance work.</p>
							 
						):(
								
									
									<FreelanceBidList freelanceBidList={freelanceBidList.freelanceBidList} />
								
						)
					}
				
				</div> 
			</InfiniteScrollContainer>
		</>
	);
};

export default FreelanceBidsPage;
