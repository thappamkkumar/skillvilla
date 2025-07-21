 
import   { memo }  from 'react';  
import { Outlet  } from 'react-router-dom';
import Row   from 'react-bootstrap/Row';
import   Col   from 'react-bootstrap/Col';

import CreateType from '../../../Components/Customer/Create/CreateType';

const CreatePage = () => { 
	 
		 
	return ( 
		<div className="   pt-2 pb-5 main_container  ">
			<Row className="  p-0 m-0   ">
        
				<Col xs={12} sm={12} md={12} lg={10} xl={8} xxl={8} className=" mx-auto my-0 p-0      ">
          <CreateType />
        </Col>
				
				<Col xs={12} sm={12}  className=" p-0 m-0   pt-4   px-0 px-md-4 px-lg-5">
          <Outlet />
        </Col>
			</Row>
		</div>
		  
				
			 
	);
	 
	 
		 
		 
};

export default memo(CreatePage);
