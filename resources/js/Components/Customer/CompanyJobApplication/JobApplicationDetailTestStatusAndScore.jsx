import {memo} from "react"; 

const JobApplicationDetailTestStatusAndScore = ({ testStatus, testScore }) => {
  return (
    <div className=" py-2 mt-2 d-flex flex-wrap gap-3 fs-5 fw-bold text-secondary justify-content-center jobApplicationDetailCandidateContact">
      <p className="m-0"><span>Test : </span> <span>{testStatus ? 'Pass' : 'Failed'}</span></p>
			<p className="m-0">|</p>
			<p className="m-0"><span> Score : </span> <span>{testScore}%</span></p>
    </div>
  );
};

export default memo(JobApplicationDetailTestStatusAndScore);
