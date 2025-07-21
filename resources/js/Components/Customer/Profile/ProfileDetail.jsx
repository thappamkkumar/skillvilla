import { memo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ProfileDetail = ({ userProfileData }) => {
  return (
    <div className="w-100 h-auto px-2 px-lg-5  pt-4  ">
     
      <Row className="p-0 m-0 px-2 px-lg-5 pt-4 pb-3  rounded sub_main_container">
				 <Col xs={12} className="   ">
					 <h2 className="    pb-2 border-bottom">Detail</h2>
				 </Col>
        {[
          { label: 'Email', value: userProfileData?.email },
          { label: 'Mobile Number', value: userProfileData?.customer?.mobile_number },
          { label: 'Village / City', value: userProfileData?.customer?.city_village },
          { label: 'State', value: userProfileData?.customer?.state },
          { label: 'Country', value: userProfileData?.customer?.country },
        ].map(({ label, value }, index) => (
          <Col key={index} xs={12} sm={6} lg={4} className="  p-3">
            <strong className=" ">{label}:</strong> <br />
            <span  className="d-block text-truncate"	>{value  }</span>
          </Col>
        ))}

        {/* Interest Section */}
        <Col xs={12} className="  p-3">
          <strong className=" ">Interest:</strong>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {userProfileData?.customer?.interest?.length > 0 ? (
              userProfileData.customer.interest.map((skill, index) => (
                <span key={index} className="    tech_skill   pt-1 pb-2 px-3 rounded ">
                  {skill}
                </span>
              ))
            ) : (
              <span  >No interests provided.</span>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default memo(ProfileDetail);
