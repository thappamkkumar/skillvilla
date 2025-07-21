const downloadFile = async(ID, attachment, path, authToken) =>
{
	try
		{ 
			const serverURL = window.location.origin + path;
			let headers  = { Authorization : `Bearer ${authToken}` };
		  const response = await axios.post(
												serverURL,
												{ id: ID },
												{
													responseType: 'blob',
													headers: {
														Authorization: `Bearer ${authToken}`,
													},
												}
											);


        // Create a URL for the file and trigger a download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', attachment);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
			  
		}
		catch(error)
		{
			//console.log(error); 
		}
};
export default downloadFile;