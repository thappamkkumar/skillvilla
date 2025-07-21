import { memo, useCallback }  from 'react'; 
 import { useDispatch,  useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';   
 
import ExploreCommunity from '../../../components/Customer/ExploreCommunity/ExploreCommunity'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)



import { updatePostState } from '../../../StoreWrapper/Slice/TaggedSavedPostSlice';  
import {updateWorkfolioState} from '../../../StoreWrapper/Slice/SavedWorkfolioSlice';
import {updateProblemState} from '../../../StoreWrapper/Slice/SavedProblemSlice';  
import {updateJobState} from '../../../StoreWrapper/Slice/AppliedSavedJobSlice';
import {updateFreelanceState} from '../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice'; 
import {updateCommunityDetailState} from '../../../StoreWrapper/Slice/CommunityDetailSlice'; 
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const ExploreCommunityPage = () => { 
 	const communityList = useSelector((state) => state.suggestionCommunityList); //selecting chat List from store
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
	
	const handleNavigateToCommunityBox = useCallback((id) => {
			dispatch(updatePostState({ type: 'refresh' }));
		  dispatch(updateWorkfolioState({ type: 'refresh' }));
		  dispatch(updateProblemState({ type: 'refresh' }));
			dispatch(updateJobState({ type: 'refresh' }));
			dispatch(updateFreelanceState({ type: 'refresh' }));
			dispatch(updateCommunityDetailState({ type: 'refresh' }));
			
        let url = `/community/${id}/detail/posts`;
       // manageVisitedUrl(url,'append' );
        navigate(url); 
				 
    }, [ ]);
	
	
	return ( 
		<>
			<PageSeo 
				title="Explore Communities | SkillVilla"
				description="Join professional communities based on your interests. Explore group discussions, projects, and opportunities."
				keywords="communities, professional groups, collaboration, discussions, community projects"
			/>

			<Row className="w-100 mx-auto  px-0 py-0 px-sm-3 px-md-4 px-lg-5">
        {communityList.communityList.map((community, index) => (
          <Col xs={6} sm={6} md={4} lg={3} key={index} className="  m-0 p-2">
            {/* Display each post inside a column */}
            <div className="  rounded-2    post user_card p-2 " 
						onClick={()=>{handleNavigateToCommunityBox(community.id)}}>
              <ExploreCommunity community={community} />
            </div>
          </Col>
        ))}
      </Row>
		 </>
	);
};

export default memo(ExploreCommunityPage);
