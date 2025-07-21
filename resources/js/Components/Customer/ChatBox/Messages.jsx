import { memo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
 
 
import MessageItem from './MessageItem'; 


const Messages = ({ messages }) => {
	
  const loggedUserData = JSON.parse(useSelector((state) => state.auth.user)); // Get login info
  const authToken = useSelector((state) => state.auth.token); // Selecting token from store
	const [loading, setLoading]=useState(false);
	

	// Sort messages in ascending order (oldest first)
 const sortedDates = Object.keys(messages).sort((a, b) => {
   
  const [dayA, monthA, yearA] = a.split('-').map(Number);
  const [dayB, monthB, yearB] = b.split('-').map(Number);
  
  return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
});


  // Function to check if the date is today or yesterday
  const formatMessageDate = (date) => {
		const dateParts = date.split('-');
		const messageDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
 
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }

    if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    }

    return date; // Show the full date if it's not today or yesterday
  };
	
  // Function to handle downloading attachments
  const handleDownloadAttachment = useCallback(async (message_id, attachment) => {
    try {
			setLoading(true);
      await downloadFile(message_id, attachment, '/download-message-attachment', authToken);
			setLoading(false);
    } catch (error) {
			setLoading(false);
      //console.error('Error downloading file:', error);
    }
  }, [authToken]);
   
 
  return (
    <div className=" d-flex flex-column   ">
      {sortedDates.reverse().map(( date ) => (
        <div key={date}   >
          {/* Display the date */}
          <div className=" text-center  py-2     sticky-date ">
						<small className="fw-bold">{formatMessageDate(date)}</small>
          </div>
          
					<div className="py-4"> 
						{/* Display the messages for that date */}
						{messages[date].map((message) => (
							 
							<MessageItem
								key={message.id}
								message={message}
								loggedUserData={loggedUserData}
								authToken={authToken}
							/>
						))}
					</div>
        </div>
      ))}
    </div>
  );
};

export default memo(Messages);
