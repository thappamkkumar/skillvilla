import ExploreSearchBar from './ExploreSearchBar';
import ExploreSearchType from './ExploreSearchType';
import Row   from 'react-bootstrap/Row';
import   Col   from 'react-bootstrap/Col';

const ExploreSearchBox = () => { 
  return ( 
     <Row className="justify-content-center p-0 m-0">
        <Col xs={12} sm={12} md={12} lg={10}   className="sub_main_container rounded-bottom overflow-hidden  p-0 ">
          <ExploreSearchBar />
          <ExploreSearchType />
        </Col>
      </Row>
     
  );
};

export default ExploreSearchBox;