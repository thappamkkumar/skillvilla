
 // Get the current URL history from session storage or initialize it as an empty array
const getUrlHistory = () => {
	const history = sessionStorage.getItem('urlHistory');
	return history ? JSON.parse(history) : ['/',];
};
// Update the URL history in session storage
const setUrlHistory = (history) => {
	sessionStorage.setItem('urlHistory', JSON.stringify(history));
};

	
const manageVisitedUrl =  (url = null, operation) =>
{ 
	
	  let urlHistory = getUrlHistory();
    if (operation == 'addNew' && url)
		{
      // Add the new new array with URL to the history
			 urlHistory.length = 0; 
			 urlHistory.push(url);
			 setUrlHistory(urlHistory);
		  
		 
		
    } 
		else if (operation == 'append' && url) 
		{
      // Add the new URL to the history
			let lastVal = '';
			if (urlHistory.length !== 0) 
			{
				lastVal=	urlHistory[urlHistory.length - 1];
			}
			if(lastVal !== url)
			{
				urlHistory.push(url);
				setUrlHistory(urlHistory);
			} 
			 
    } 
		else if(operation == 'popUrl') 
		{
      // Remove the last URL from the history and return it
      let removedUrl = urlHistory.pop();
      removedUrl = urlHistory[urlHistory.length - 1]; 
      setUrlHistory(urlHistory);
			return removedUrl;
    }
		else if(operation == 'getUrl')
		{
			let getUrl = urlHistory[urlHistory.length - 1]; 
      return getUrl;
		}
		else
		{
			//console.log('nothing operate');
		} 
};
export default manageVisitedUrl;