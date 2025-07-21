import { memo } from 'react';

const JobDetailContact = ({ jobDetail }) => {
  return (
    <div className="pb-4">
      <h4>Contact</h4>
      {jobDetail?.company?.website && (
        <p className="m-0">
          <strong>Website: </strong>
          <a
            href={jobDetail.company.website}
            target="_blank"
            rel="noopener noreferrer"
            title="Company website link"
            className="post_tags ps-2"
          >
            {jobDetail.company.website}
          </a>
        </p>
      )}
      {jobDetail?.email && (
        <p className="m-0">
          <strong>Email: </strong>
          <a
            href={`mailto:${jobDetail.email}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Send an email"
            className="text-decoration-none post_tags ps-2"
          >
            {jobDetail.email}
          </a>
        </p>
      )}
      {jobDetail?.phone && (
        <p className="m-0">
          <strong>Phone: </strong>
          <a
            href={`tel:${jobDetail.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Call this number"
            className="text-decoration-none post_tags ps-2"
          >
            {jobDetail.phone}
          </a>
        </p>
      )}
    </div>
  );
};

export default memo(JobDetailContact);
