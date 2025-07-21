const handleImageError =  (event, src) =>
{ 
	try{
			event.target.onerror = null;
			//console.log('file.loading error');
			event.target.src = src; // Set a fallback image URL
		}
		catch(error)
		{
			//console.log('error in fetching image while handling profile image error');
		}
};
export default handleImageError;