import { memo } from 'react';

import Post from '../Post/Post';  
import Workfolio from '../Workfolio/Workfolio'; 
import Problem from '../Problem/Problem';
import Job from '../CompanyJob/Job';  
import Freelance from '../Freelance/Freelance';
import {
  BsChatRightDots,
  BsBriefcase,
  BsQuestionOctagon,
  BsFolderPlus,
  BsCodeSquare,
} from 'react-icons/bs';

const COMPONENT_MAP = {
  post: Post,
  workfolio: Workfolio,
  problem: Problem,
  job: Job,
  freelance: Freelance,
};

const LABEL_MAP = {
  post: 'Post',
  workfolio: 'Workfolio',
  problem: 'Problem',
  job: 'Job',
  freelance: 'Freelance',
};

const ICON_MAP   = {
  post: <BsChatRightDots />,
  job: <BsBriefcase />,
  problem: <BsQuestionOctagon />,
  workfolio: <BsFolderPlus />,
  freelance: <BsCodeSquare />,
};
const BADGE_MAP = {
  post: 'bg-primary-subtle text-dark',
  workfolio: 'bg-warning-subtle text-dark',
  problem: 'bg-danger-subtle text-dark ',
  job: 'bg-success-subtle text-dark',
  freelance: 'bg-info-subtle text-dark',
};


const FeedList = ({ feedList }) => {
  return (
    <div
      className="w-100 px-2 py-0 px-sm-3 px-md-4 px-lg-5 "
      style={{ maxWidth: '768px' }}
    >
      {feedList.map((feed, index) => {
        const Component = COMPONENT_MAP[feed.type];
        const label = LABEL_MAP[feed.type];
        const icon = ICON_MAP[feed.type];

        if (!Component) return null; // skip unknown types

        return (
          <div key={index} className="mb-3">
            <p className="m-0 pb-2">
              <span className={`badge rounded-2 px-3 py-2 d-inline-flex gap-2 align-items-center ${BADGE_MAP[feed.type]}`}>
								{icon} {label} 
							</span>

            </p> 
            <Component {...{ [feed.type]: feed }} />
          </div>
        );
      })}
    </div>
  );
};

export default memo(FeedList);
