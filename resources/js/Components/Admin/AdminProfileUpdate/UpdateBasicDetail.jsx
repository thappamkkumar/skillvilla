import { memo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const UpdateBasicDetail = ({ userData, handleUserDetailUpdate, handleKeyPress }) => {
  const fields = [
    { label: 'User ID', name: 'userID', value: userData.userID },
    { label: 'Name', name: 'name', value: userData.name },
    { label: 'Mobile Number', name: 'mobile_number', value: userData.mobileNumber },
    { label: 'Village / City', name: 'city_village', value: userData.cityVillage },
    { label: 'State', name: 'state', value: userData.state },
    { label: 'Country', name: 'country', value: userData.country },
  ];

  return (
    <Row className="p-0 m-0 ">
      {fields.map(({ label, name, value }, index) => (
        <Col key={index} xs={12} sm={6} lg={6} className="  p-3">
          <Form.Group controlId={`form${name}`}>
            <Form.Label><strong className="text-muted">{label}</strong></Form.Label>
            <Form.Control
              type="text"
              defaultValue={value}
              name={name}
              className="shadow-none bg-light formInput"
              onBlur={handleUserDetailUpdate}
              onKeyDown={handleKeyPress}
              autoComplete="off"
            />
          </Form.Group>
        </Col>
      ))}
    </Row>
  );
};

export default memo(UpdateBasicDetail);
