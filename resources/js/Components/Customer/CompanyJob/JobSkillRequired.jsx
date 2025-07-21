import { memo } from 'react';

const JobSkillRequired = ({ skillRequired }) => {
  return (
    <div className=" ">
      {/* Skills Section */}
      {skillRequired && skillRequired.length > 0 && (
        <div className=" "> 
          <div className="d-flex flex-wrap gap-2">
            {skillRequired.map((skill, index) => (
              <span key={index} className=" py-1 px-2 rounded-1 tech_skill">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(JobSkillRequired);
