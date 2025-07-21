 
import {memo,useMemo,  useCallback} from 'react'; 
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; 
import {useSelector } from 'react-redux'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const PostTags= ({postID, tags, total}) => { 

	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate

	const displayedTags = useMemo(() => {
        return total ? tags.slice(0, total) : tags;
  }, [tags, total]);
	 
	const handleNavigateToUserProfile = useCallback((user_id, ID)=>{
		
		
		if(logedUserData.id == ID )
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
		//	manageVisitedUrl(`/user/${user_id}/${ID}/profile`, 'append');
			navigate(`/user/${user_id}/${ID}/profile`);
		
		}
	}, []);
	
	return ( 
		<div className={`w-100  h-auto d-flex flex-wrap gap-2    ${total && 'post_tags_container'}    pb-1  `}>
			{displayedTags.map((tag, index) => ( 
				<Button variant="*"   key={index} onClick={()=>{handleNavigateToUserProfile(tag.userID, tag.id); }} className="p-0   d-inline-block border-0  post_tags  " id={`tag_${postID}_${index}`} title={`Go to tagged user ${tag.userID} profile`}>
						@{tag.userID}{(index < displayedTags.length - 1)&& ','} 
					</Button>
			))} 
			
			 <span className={` ${displayedTags.length <= 0 ? 'text-muted d-block' : 'd-none'}`}> ... </span>
			
		</div>
	);
	
};

export default memo(PostTags);
