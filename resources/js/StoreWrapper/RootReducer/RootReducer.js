import {combineReducers} from '@reduxjs/toolkit';
import AuthReducer from '../Slice/AuthSlice'; 
import userNavBarReducer from '../Slice/userNavBarSlice';

import PostReducer from '../Slice/PostSlice';
import CommentReducer from '../Slice/CommentSlice';
import UserPostReducer  from '../Slice/UserPostSlice';
import MyPostReducer  from '../Slice/MyPostSlice';
import TaggedSavedPostReducer  from '../Slice/TaggedSavedPostSlice';
 
import ChatReducer  from '../Slice/ChatSlice';
import ChatMessageReducer  from '../Slice/ChatMessageSlice';
import ChatCallReducer  from '../Slice/ChatCallSlice';

import WorkfolioReducer  from '../Slice/WorkfolioSlice';
import UserWorkfolioReducer  from '../Slice/UserWorkfolioSlice';
import MyWorkfolioReducer  from '../Slice/MyWorkfolioSlice';
import SavedWorkfolioReducer  from '../Slice/SavedWorkfolioSlice';

import ProblemReducer  from '../Slice/ProblemSlice';
import UserProblemReducer  from '../Slice/UserProblemSlice';
import MyProblemReducer  from '../Slice/MyProblemSlice';
import SavedProblemReducer  from '../Slice/SavedProblemSlice';

import StoriesReducer  from '../Slice/StoriesSlice';
import UserStoriesReducer  from '../Slice/UserStoriesSlice';

import JobReducer  from '../Slice/JobSlice'; 
import UserJobReducer  from '../Slice/UserJobSlice';
import MyJobReducer  from '../Slice/MyJobSlice';
import AppliedSavedJobReducer  from '../Slice/AppliedSavedJobSlice';

import JobApplicationReducer  from '../Slice/JobApplicationSlice';

import FreelanceReducer  from '../Slice/FreelanceSlice';
import UserFreelanceReducer  from '../Slice/UserFreelanceSlice';
import MyFreelanceReducer  from '../Slice/MyFreelanceSlice';
import AppliedSavedFreelanceReducer  from '../Slice/AppliedSavedFreelanceSlice';

import FreelanceBidReducer  from '../Slice/FreelanceBidSlice';

import ExploreJobFilterReducer  from '../Slice/ExploreJobFilterSlice';
import ExploreSearchReducer  from '../Slice/ExploreSearchSlice';

import UserReducer from '../Slice/UserSlice';

import YourCommunityReducer from '../Slice/YourCommunitySlice';
import JoinedCommunityReducer from '../Slice/JoinedCommunitySlice';
import SuggestionCommunityReducer from '../Slice/SuggestionCommunitySlice';
import CommunityDetailReducer from '../Slice/CommunityDetailSlice';
import CommunityMessageReducer from '../Slice/CommunityMessageSlice';
import CommunityMemberReducer from '../Slice/CommunityMemberSlice';
import CommunityRequestReducer from '../Slice/CommunityRequestSlice';

import ShareStatsReducer from '../Slice/ShareStatsSlice';


import FeedReducer from '../Slice/FeedSlice';

import LiveStreamReducer from '../Slice/LiveStreamSlice';
import ActiveLiveReducer from '../Slice/ActiveLiveSlice';



//admin
import AdminListReducer from '../Slice/Admin/AdminListSlice';


//combine all reducer of slices

const RootReducer = combineReducers(
	{
		auth: AuthReducer, // for logged user data
		userNavBar: userNavBarReducer, // for nav bar toogling
	
		postList: PostReducer, //for list of post of   user followings and interested
		myPostList: MyPostReducer, //for list of my post of logged user 
		userPostList: UserPostReducer,  //for list of post of logged or selected user
		taggedSavedPostList: TaggedSavedPostReducer,  //for list of tagged or saved  post  
		commentList: CommentReducer, // for comment of post 
		 
		chatList: ChatReducer, // for list of chat of logged user
		messageList: ChatMessageReducer,   
		chatCallData: ChatCallReducer,   
		
		workfolioList:WorkfolioReducer, //for list of work of logged user followings
		userWorkfolioList: UserWorkfolioReducer,  //for list of work of logged or selected user
		myWorkfolioList: MyWorkfolioReducer,   
		savedWorkfolioList: SavedWorkfolioReducer,   
		
		problemList:ProblemReducer, //for list of problem of logged user followings
		userProblemList: UserProblemReducer,  //for list of problem of logged or selected user
		myProblemList: MyProblemReducer,  
		savedProblemList: SavedProblemReducer,  
		
		storiesList:StoriesReducer, //for list of problem of logged user followings
		userStoriesList: UserStoriesReducer,  //for list of problem of logged or selected user
		
		jobList: JobReducer,  //for list of job of logged  
		userJobList: UserJobReducer,  //for list of job of users 
		myJobList: MyJobReducer,  
		appliedSavedJobList: AppliedSavedJobReducer,  
		
		jobApplicationList: JobApplicationReducer,  //for list of application on job of users 
	
		freelanceList: FreelanceReducer,  //for list of Freelance  of users 
		userFreelanceList: UserFreelanceReducer,  //for list of   Freelance  logged or selected user
		myFreelanceList: MyFreelanceReducer,   
		appliedSavedFreelanceList: AppliedSavedFreelanceReducer,   
		
		freelanceBidList: FreelanceBidReducer,  //for list of   Freelance bid of user
		
		
		exploreJobFilters: ExploreJobFilterReducer,  //for explore job filters
		exploreSearch: ExploreSearchReducer,  //for explore  search
	
		userList: UserReducer,  //for user list
		
		yourCommunityList: YourCommunityReducer,  //for community list of logged user own
		joinedCommunityList: JoinedCommunityReducer,  //for  community list of logged user joined
		suggestionCommunityList: SuggestionCommunityReducer,  //for  community list for suggestions
		communityDetail: CommunityDetailReducer,  //for  community detail
		communityMessageList: CommunityMessageReducer,  //for  community messages
		communityMemberList: CommunityMemberReducer,  //for  community members
		communityRequestList: CommunityRequestReducer,  //for  community request 
		
		
		shareStats: ShareStatsReducer,  //for share Stats 
		
		
		feedList: FeedReducer,  //for mix feed in home page
		
		liveStreamData : LiveStreamReducer,  //for live stream data
		activeLiveList: ActiveLiveReducer,  //for active live list
		
		
		
		
		//Admin
		AdminDataList: AdminListReducer,   
		
		
		
	
	
	}
);
export default RootReducer;