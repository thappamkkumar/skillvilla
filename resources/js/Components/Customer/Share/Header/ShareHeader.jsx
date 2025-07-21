 
import {memo, useState,   useCallback  } from 'react';   
import {useSelector } from 'react-redux';   

const ShareHeader = ({setSelectedList}) => {  
	const selectedFeature = useSelector((state) => state.shareStats.selectedFeature);  
	const selectedId = useSelector((state) => state.shareStats.selectedId);  
	
	const [activeButton, setActiveButton] = useState(1);
	const [urlCopied, setUrlCopied] = useState(false);
	
	const showUsersBox = useCallback(()=>{
		setSelectedList('user');
		setActiveButton(1);
	}, []);
	
	const showCommunityBox = useCallback(()=>{
		setSelectedList('community');
		setActiveButton(2);
	}, []);
	
	
	const copyUrl = useCallback(async()=>{
		try
		{
			await navigator.clipboard.writeText('dfdgdfg');
		}
		catch(e)
		{
			//console.log(e);
		}
		setUrlCopied(true);
	}, []);
	
	return ( 
		 <div className="d-flex align-items-center gap-3 px-3 sharePageHeader">
		  <button 
				className={`   sharePageHeaderBTN ${activeButton == 1 && 'active_sharePageHeaderBTN'} `}
				id="userListBTN"
				title="userList"
				onClick={showUsersBox}
			>
				Users
		  </button>
			
			<button 
				className={`     sharePageHeaderBTN ${activeButton == 2 && 'active_sharePageHeaderBTN'} `}
				id="communityListBTN"
				title="communityList"
				onClick={showCommunityBox}
			>
				Community
		  </button>
			
			<span className="fw-bold fs-5 pb-1 text-secondary"> | </span>
			
			<button 
				className="btn btn-light p-0 px-2 pb-1 fs-6"
				id="copyUrlBTN"
				title="Copy url"
				onClick={copyUrl}
				disabled = {urlCopied}
			>
				{
					urlCopied ?
					'Copied !'
					:
					'Copy Url'
				}
		  </button>
			
		 </div>
      
		 
	);
	
};

export default memo(ShareHeader);
