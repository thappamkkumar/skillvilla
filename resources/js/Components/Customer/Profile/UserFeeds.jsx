import { memo, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

import { updatePostState as updateUserPostState  } from '../../../StoreWrapper/Slice/UserPostSlice'; 
import { updatePostState as updateMyPostState  } from '../../../StoreWrapper/Slice/MyPostSlice'; 

import {updateWorkfolioState as updateMyWorkfolioState} from '../../../StoreWrapper/Slice/MyWorkfolioSlice';
import {updateWorkfolioState as updateUserWorkfolioState } from '../../../StoreWrapper/Slice/UserWorkfolioSlice';
 
import {updateProblemState as updateMyProblemState} from '../../../StoreWrapper/Slice/MyProblemSlice';
import { updateProblemState as updateUserProblemState } from '../../../StoreWrapper/Slice/UserProblemSlice'; 

import {updateJobState as updateUserJobState} from '../../../StoreWrapper/Slice/UserJobSlice';
import {updateJobState as updateMyJobState} from '../../../StoreWrapper/Slice/MyJobSlice';

import {updateFreelanceState as updateMyFreelanceState} from '../../../StoreWrapper/Slice/MyFreelanceSlice';
import {updateFreelanceState as updateUserFreelanceState} from '../../../StoreWrapper/Slice/UserFreelanceSlice';
 

const UserFeeds = ({ userID, id }) => {
  const navigate = useNavigate();
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
  const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));
  const isCurrentUser = useMemo(() => loggedUserData?.id == id, [loggedUserData, id]);
 
  // Navigation items configuration
	const navItems = [
    { type: 'post', label: 'Posts', myPath: '/posts/my-posts', userPath: `/user/${userID}/${id}/posts` },
    { type: 'workfolio', label: 'Workfolio', myPath: '/workfolio/my-works', userPath: `/user/${userID}/${id}/workfolio` },
    { type: 'problem', label: 'Problems', myPath: '/problems/my-problems', userPath: `/user/${userID}/${id}/problems` },
    { type: 'jobs', label: 'Jobs', myPath: '/jobs/my-jobs', userPath: `/user/${userID}/${id}/jobs` },
    { type: 'freelance', label: 'Freelance', myPath: '/freelance/my-freelance', userPath: `/user/${userID}/${id}/freelance` },
  ]; 
  

	useEffect(()=>{
		if(isCurrentUser)
		{
			dispatch(updateMyPostState({type : 'refresh', }));  
			dispatch(updateMyWorkfolioState({type : 'refresh', }));  
			dispatch(updateMyProblemState({type : 'refresh', }));  
			dispatch(updateMyJobState({type : 'refresh', }));  
			dispatch(updateMyFreelanceState({type : 'refresh', }));  
		}
		else
		{
			dispatch(updateUserPostState({type : 'refresh', }));  
			dispatch(updateUserWorkfolioState({type : 'refresh', }));  
			dispatch(updateUserProblemState({type : 'refresh', }));  
			dispatch(updateUserJobState({type : 'refresh', }));  
			dispatch(updateUserFreelanceState({type : 'refresh', }));  
		}
		
	},[userID, id]);

  return (
    <div className="w-100 sub_main_container rounded-1 shadow">
      <Navbar className="p-0 w-100 nav_bar">
        <Nav className="w-100 gap-1 px-2 py-2 overflow-auto justify-content-around">
					{navItems.map(({ type, label, myPath, userPath }) => {
            const url = isCurrentUser ? myPath : userPath;
            return (
							<Nav.Item key={type} className="flex-grow-1">
								<Nav.Link
									as={NavLink}
									to={url} 
									className="rounded-1 px-2 py-1  navigation_link explore_navigation_link text-center  "
									title={`Go to ${label.toLowerCase()} page`}
								>
									{label}
								</Nav.Link>
							</Nav.Item>
               
            );
          })}
				</Nav>
			</Navbar>
    </div>
  );
};

export default memo(UserFeeds);
