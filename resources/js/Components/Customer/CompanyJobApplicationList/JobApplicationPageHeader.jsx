import { memo } from 'react';  
import changeNumberIntoHumanReadableForm from '../../../CustomHook/changeNumberIntoHumanReadableForm'; 

const JobApplicationPageHeader = ({ jobData }) => {
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
       
         
          <div  >
            <h3 className="fw-bold"> {jobData?.title || 'Unknown Job Title'}</h3>
          </div>

           
          
            <div className="   py-2 px-3 rounded-1  tech_skill">
                <strong>Total Applications :  </strong>
								<span>{changeNumberIntoHumanReadableForm(jobData?.totalApplications || 0)} </span>
                 
            </div> 
    </div>
  );
};

export default memo(JobApplicationPageHeader);
