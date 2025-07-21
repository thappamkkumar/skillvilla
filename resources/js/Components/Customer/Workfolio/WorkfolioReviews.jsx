import { memo, useState, useEffect  } from 'react';  
import {useSelector } from 'react-redux'; 
import WorkfolioAddReview from './WorkfolioAddReview';
import WorkfolioReviewList from './WorkfolioReviewList';

import useAddNewWorkfolioReviewWebsocket from '../../../Websockets/Workfolio/useAddNewWorkfolioReviewWebsocket';

const WorkfolioReviews = ({ workfolio_id, updateAvgAndCount }) => {
  const [workfolioReviewList, setWorkfolioReviewList] = useState([]);
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	
	//call hook for websocket eventListener
	useAddNewWorkfolioReviewWebsocket(
	logedUserData,
	workfolio_id,
	setWorkfolioReviewList,
	)
	
	
  return (
    <div className=" ">
      
       <WorkfolioAddReview workfolio_id={workfolio_id}  setWorkfolioReviewList={setWorkfolioReviewList} updateAvgAndCount={updateAvgAndCount}/>
       <WorkfolioReviewList workfolio_id={workfolio_id} workfolioReviewList={workfolioReviewList}  setWorkfolioReviewList={setWorkfolioReviewList}/>
    </div>
  );
};

export default memo(WorkfolioReviews);
