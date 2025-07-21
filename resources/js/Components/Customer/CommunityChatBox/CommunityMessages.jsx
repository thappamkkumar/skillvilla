import { memo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { BsDownload,   } from "react-icons/bs";
import downloadFile from '../../../CustomHook/downloadFile';

 
import WorkfolioUploadBy from '../Workfolio/WorkfolioUploadBy';
 







const CommunityMessages = ({ messages }) => {
	
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
      await downloadFile(message_id, attachment, '/community/download-message-attachment', authToken);
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
          
					{/* Display message for that date */}
					<div className="py-4">
            {messages[date].map((message, index, messageArray) => {
              const isLastInGroup = index === messageArray.length - 1 || messageArray[index + 1].sender_id !== message.sender_id;
              return (
                
								<div key={message.id} className={`py-2 px-3 d-flex flex-column ${message.sender_id === loggedUserData.id ? 'align-items-end' : 'align-items-start'} `}>
                  
									<div className={`${message.sender_id === loggedUserData.id ? 'current_user_message' : 'other_user_message'} chatBox_chat py-2 px-3`}>
                    
										{message.attachment && (
                      <div className="d-flex align-items-start pb-2">
                        <Button variant="outline-secondary" onClick={() => handleDownloadAttachment(message.id, message.attachment)} disabled={loading}>
                          {loading ? <Spinner animation="border" size="sm" /> : <BsDownload style={{ strokeWidth: '1.2' }} />}
                        </Button>
                        <Button variant="*" className="text-secondary text-start text-break" onClick={() => handleDownloadAttachment(message.id, message.attachment)}>
                          {message.attachment}
                        </Button>
                      </div>
                    )}
                   
										<p className="m-0 text-break">{message.message}</p>
                   
										<div className="m-0 text-end">
                      <small>{message.human_readable_message_time}</small>
                    </div>
                    
                  </div>
									
									{
										isLastInGroup && message.sender_id != loggedUserData.id && 
										(
											<div className="mt-2 workfolio p-2 rounded     ">
												<WorkfolioUploadBy 
													user={message.sender}
													id={message.id}
												/>
													 
											</div>
										 )
									}
									
                </div>
              );
            })}
          </div>
					
        </div>
      ))}
    </div>
  );
};

export default memo(CommunityMessages);
