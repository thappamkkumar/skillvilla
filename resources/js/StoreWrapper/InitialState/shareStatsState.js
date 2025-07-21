 
//initial state for store data about  share post, workfolio etc. 
const shareStatsState = 
{
	selectedId:null,
	selectedFeature:"",
	
	userList:[], 
	userCursor:null, 
	userHasMore:false,
	
	communityList:[], 
	communityCursor:null, 
	communityHasMore:false,
};
 
export default shareStatsState;