
import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import { BsEmojiLaughing  } from 'react-icons/bs';

const ReactionControl= () => {
  return (
		<Button 
			variant="light"
			title="Reactions" 
			id="reactionControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
		>
			<BsEmojiLaughing    />
		</Button>
	);
};

export default memo(ReactionControl);
