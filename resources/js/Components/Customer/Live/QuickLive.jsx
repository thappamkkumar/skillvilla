import { memo, useCallback } from 'react';
import Image from 'react-bootstrap/Image';
import Button from "react-bootstrap/Button";
import handleImageError from '../../../CustomHook/handleImageError';

const QuickLive = ({ live }) => {

  const handleNavigateToUserProfile = useCallback(() => {
    // navigation handler here
		alert('handle live signaling.');
  }, [live]);

  return (
	
		<Button 
			variant="light"
			id={`quickLive${live.id}`}
			title={`Go live with ${live?.publisher?.name || "Unknown User"}`}
			className="w-100 px-2 py-2 d-flex flex-wrap align-items-center"
			onClick={handleNavigateToUserProfile}
		>
     
      {/* IMAGE */}
      <div className="btn p-0 border-0">
        <Image
          src={live?.publisher?.customer?.image || "/images/login_icon.png"}
          className="profile_img"
          alt={`profile image of ${live?.publisher?.userID || "user"}`}
          onError={(e) => handleImageError(e, "/images/login_icon.png")}
        />
      </div>

      {/* TEXT Only on XL+ */}
      <div className="d-none d-xl-flex flex-column ms-2"  >
        <strong
          className="text-truncate overflow-hidden text-nowrap userCard_userName"
        >
          {live?.publisher?.name || "Unknown User"}
        </strong>

        <small
          className=" text-truncate overflow-hidden text-nowrap userCard_userID"
        >
          {live?.created_at_human_readable || ""}
        </small>
      </div>
    </Button>
  );
};

export default memo(QuickLive);
