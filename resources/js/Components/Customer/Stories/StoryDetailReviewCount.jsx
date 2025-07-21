 
import  {useEffect,useState, memo} from 'react';  
 
import changeNumberIntoHumanReadableForm from '../../../CustomHook/changeNumberIntoHumanReadableForm'; 
 
const StoryDetailReviewCount = ({likeCount, commentCount}) => { 
 const [storyReviewCount, setStoryReviewCount] = useState({});
	useEffect(()=>{ 
		 
		//convert total likes into human readable Form
		let likes = changeNumberIntoHumanReadableForm(likeCount);
		//convert total comments into human readable Form
		let comments = changeNumberIntoHumanReadableForm(commentCount);
		setStoryReviewCount({totalLikes:likes, totalComments:comments});
		
	}, [likeCount, commentCount]);
	  
	return (  
		<div className="py-2 d-flex align-items-center justify-content-around   " >
			<div className="text-center">
				<div className="fs-4 fw-bold text-dark">{storyReviewCount.totalLikes}</div>
				<div className="text-muted">Likes</div>
			</div>
			<div className="text-center">
				<div className="fs-4 fw-bold text-dark">{storyReviewCount.totalComments}</div>
				<div className="text-muted">Comments</div>
			</div>
		</div>	 
		  
	);
	
};

export default memo(StoryDetailReviewCount);
