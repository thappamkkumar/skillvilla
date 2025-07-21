import { memo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ProfileDetail = ({ profileData }) => {
  return (
    <div className="w-100 h-auto px-2 px-lg-5  pt-4  ">
     
      <Row className="p-0 m-0 px-2 px-lg-5 pt-4 pb-3  rounded sub_main_container">
				 <Col xs={12} className="   ">
					 <h2 className="    pb-2 border-bottom">Detail</h2>
				 </Col>
        {[
          { label: 'Email', value: profileData?.email },
          { label: 'Mobile Number', value: profileData?.admin?.mobile_number },
          { label: 'Village / City', value: profileData?.admin?.city_village },
          { label: 'State', value: profileData?.admin?.state },
          { label: 'Country', value: profileData?.admin?.country },
        ].map(({ label, value }, index) => (
          <Col key={index} xs={12} sm={6} lg={4} className="  p-3">
            <strong className=" ">{label}:</strong> <br />
            <span  className="d-block text-truncate"	 >{value  }   </span>
          </Col>
        ))}
 
        
      </Row>
    </div>
  );
};

export default memo(ProfileDetail);
