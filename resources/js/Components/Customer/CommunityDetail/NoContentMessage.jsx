import { memo } from 'react';

const NoContentMessage = ({ type }) => {
  const messages = {
    posts: "No posts available.",
    workfolio: "No work shared yet.",
    jobs: "No job listings found.",
    problems: "No problems posted.",
    freelance: "No freelance work available."
  };

  return <p className="no_posts_message">{messages[type]}</p>;
};

export default memo(NoContentMessage);
