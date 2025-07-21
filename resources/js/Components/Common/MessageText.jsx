import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

const MessageText = ({ text, id }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  if (!text || text.trim() === '') return null;

  const isLong = text.length > 300;
  const displayText = expanded ? text : `${text.slice(0, 500)}...`;

  return (
    
      <div className="text-break">
        {isLong ? displayText : text}
					
				{isLong && (
					<Button
						variant="outline-secondary"
						className="mx-2 py-1 lh-1 mt-2"
						title={expanded ? 'Show less' : 'Show more'}
						id={`${expanded ? 'showLessTextBtn' : 'showMoreTextBtn'}${id}`}
						onClick={toggleExpanded}
					>
						{expanded ? <BsChevronUp className="fs-6" /> : <BsChevronDown className="fs-6" />}
					</Button>
				)}
      </div>

      
    
  );
};

export default MessageText;
