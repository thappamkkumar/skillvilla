 
const serverConnection = async(path, data,  authToken, contentType=null) =>
{
	 let url = window.location.origin + path;
	  
	try
	{
		let headers = {};
		if(contentType != null)
		{
						
			headers['Content-Type'] = contentType;
		}
		headers['Authorization'] = `Bearer ${authToken}`;
		const response = await axios.post(url, data, {headers}); 
		return response.data;
		 
	}
	catch(error)
	{
		 
    console.error(error);
    console.error('server error');
       
        
	}
}; 
export default serverConnection;