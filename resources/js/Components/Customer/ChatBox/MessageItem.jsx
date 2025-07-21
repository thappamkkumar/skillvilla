import { useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { BsDownload, BsCheckAll,  BsChevronDown, BsChevronUp } from "react-icons/bs";
import downloadFile from '../../../CustomHook/downloadFile';

import MessageText from '../../Common/MessageText';
import SharedUser from './Shared/SharedUser';
import SharedCommunity from './Shared/SharedCommunity';
import SharedStory from './Shared/SharedStory';
import SharedFreelance from './Shared/SharedFreelance';
import SharedJob from './Shared/SharedJob';
import SharedProblem from './Shared/SharedProblem';
import SharedWorkfolio from './Shared/SharedWorkfolio';
import SharedPost from './Shared/SharedPost';

const MessageItem = ({  message, loggedUserData, authToken }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const handleDownloadAttachment = useCallback(async () => {
    try {
      setLoading(true);
      await downloadFile(message.id, message.attachment, '/download-message-attachment', authToken);
    } catch (error) {
      // handle error silently or log it
    } finally {
      setLoading(false);
    }
  }, [authToken, message.id, message.attachment]);

  return (
    <div className={`py-2 px-3 d-flex ${message.sender_id === loggedUserData.id ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`
        ${message.sender_id === loggedUserData.id ? 'current_user_message' : 'other_user_message'}
        ${(message.shared_freelance || message.shared_job || message.shared_problem != null || message.shared_workfolio != null) && 'w-100'}
        chatBox_chat py-3 px-3
      `}>
        
        {/* Attachment Section */}
        {message.attachment && (
          <div className="d-flex align-items-start pb-2">
            <Button variant="outline-secondary" onClick={handleDownloadAttachment} title="Download File" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : <BsDownload style={{ strokeWidth: '1.2' }} />}
            </Button>
            <Button variant="*" className="text-secondary text-start text-break" onClick={handleDownloadAttachment}>
              {message.attachment}
            </Button>
          </div>
        )}

        {/* Text Message */}
				<MessageText text={message.message} id={message.id} />
			 

        {/* Shared Content Components */}
        {message.shared_user && <SharedUser user={message.shared_user} />}
        {message.shared_community && <SharedCommunity community={message.shared_community} />}
        {message.shared_story && <SharedStory story={message.shared_story} />}
        {message.shared_freelance && <SharedFreelance freelance={message.shared_freelance} />}
        {message.shared_job && <SharedJob job={message.shared_job} />}
        {message.shared_problem && <SharedProblem problem={message.shared_problem} />}
        {message.shared_workfolio && <SharedWorkfolio workfolio={message.shared_workfolio} />}
        {message.shared_post && <SharedPost post={message.shared_post} />}

        {/* Timestamp and Read Indicator */}
        <div className="m-0 text-end">
          <small>
            {message.human_readable_message_time}
            {message.sender_id === loggedUserData.id && (
              <BsCheckAll className={message.is_read ? 'text-primary' : 'text-muted'} />
            )}
          </small>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
