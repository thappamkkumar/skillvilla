/*const checkAttechmentExtension = (attachment) =>
{
	try
	{ 
		//get extension of file or media
		const fileExtension =  attachment.split('.').pop().toLowerCase();
		
		return fileExtension;		
	}
	catch(error)
	{
		console.log(error);
	}
};
export default checkAttechmentExtension;*/

const checkAttechmentExtension = (attachment) => {
	//console.log(attachment);
  if (typeof attachment !== 'string') {
    console.error('Invalid attachment: Expected a string');
    return null;
  }

  const fileExtension = attachment.substring(attachment.lastIndexOf('.') + 1).toLowerCase();

  // Return null if no valid extension is found
  return fileExtension && fileExtension !== attachment ? fileExtension : null;
};

export default checkAttechmentExtension;
