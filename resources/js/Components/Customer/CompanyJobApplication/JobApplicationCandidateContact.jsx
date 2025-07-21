 

const JobApplicationCandidateContact = ({ user }) => {
  return (
    <div className="candidate-contact-container">
      <h4 className="m-0 p-0">Applicant Information</h4>
      <hr className="border-3 border-danger mt-2" style={{ width: '7rem' }} />

      <p className="m-0 pb-2">
        <strong className="pe-2">Email:</strong>
        <a href={`mailto:${user.email}`} className="text-decoration-none text-primary">
          {user.email}
        </a>
      </p>
      <p className="m-0 pb-2">
        <strong className="pe-2">Mobile:</strong>
        <a href={`tel:${user.customer.mobile_number}`} className="text-decoration-none text-primary">
          {user.customer.mobile_number}
        </a>
      </p>
      <p className="m-0 pb-2">
        <strong className="pe-2">Address:</strong>
        {user.customer.city_village}, {user.customer.state}, {user.customer.country}
      </p>
    </div>
  );
};

export default JobApplicationCandidateContact;
