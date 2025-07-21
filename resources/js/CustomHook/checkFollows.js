const checkFollows = (list, user_id) =>
{
	 //check current user like the post or not 
	const result = list.find(item => item.user_id === user_id); 
	if (result) 
	{ 
		 return true;
	}  
	else
	{
		return false;
	 
	} 
};

export default checkFollows;