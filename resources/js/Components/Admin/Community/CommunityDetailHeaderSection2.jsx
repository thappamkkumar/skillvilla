import { memo,} from 'react';   
import { BsGlobe, BsLockFill, BsPeopleFill, BsPersonCheckFill } from "react-icons/bs";

const CommunityDetailHeaderSection2 = ({communityDetail}) => {
	 
	 
    return (
      <div className="   d-flex flex-wrap">
        <span className="py-1 px-2 rounded-1 me-2 tech_skill d-flex align-items-center">
          {communityDetail?.privacy == "public" ? (
            <>
              <BsGlobe className="me-1" /> Public
            </>
          ) : (
            <>
              <BsLockFill className="me-1" /> Private
            </>
          )}
        </span>
        <span className="py-1 px-2 rounded-1 tech_skill d-flex align-items-center">
          {communityDetail?.content_share_access === "everyone" ? (
            <>
              <BsPeopleFill className="me-1" /> Everyone can share content
            </>
          ) : (
            <>
              <BsPersonCheckFill className="me-1" /> Selected users can share content
            </>
          )}
        </span>
      </div>
    );
   
  
};

export default memo(CommunityDetailHeaderSection2);
