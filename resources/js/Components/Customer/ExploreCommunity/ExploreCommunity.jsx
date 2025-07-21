 
import  {  memo , useCallback, useState  } from 'react'; 
import Image from 'react-bootstrap/Image'; 
import Spinner from 'react-bootstrap/Spinner'; 
 
import handleImageError from '../../../CustomHook/handleImageError';

const ExploreCommunity = ({community}) => { 
	 
	const [imageError, setImageError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);
	
	 
	
	
	
	//function for handle image loading
	const handleImageLoading = () =>
	{  
		setImageLoading(false);
	}
	
	return ( 
		<div className=" ">
			<div className="rounded-1 overflow-hidden   userCardImageContainer RelativeContainer " > 
				
				<Image 
				src={community?.image || '/images/profile_icon.png' } 
				className={` userCardImage 	${imageLoading && 'd-none'}`} 
				onLoad={handleImageLoading}
				onError={()=>{handleImageError(event, '/images/profile_icon.png'); setImageError((pre)=>!pre);  handleImageLoading();} } 
				alt={`profile image of ${community.name} `}
				/> 
				
				{
					 imageLoading &&
						<div className="w-100 h-100    d-flex justify-content-center align-items-center "  style={{'position':'absolute', 'top':'0px', 'left':'0px', 'cursor':'pointer'}}>
						 
							<Spinner  className="d-block mx-auto" animation="border"  size="md" /> 
							
						</div>
				}
				
			</div>
			<div className=" pt-2 overflow-hidden"  >
				<p className="p-0 m-0 userCard_userName text-truncate"><strong>{community.name}</strong></p>
				<p className="p-0 m-0  userCard_userID  text-truncate">
				<small>{community.members_count} members
				</small></p>
				

			</div> 
						
		</div>
	);
	
};

export default memo(ExploreCommunity);
