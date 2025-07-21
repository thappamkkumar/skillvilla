 import { useState, useCallback } from "react";

import Row   from 'react-bootstrap/Row';
import   Col   from 'react-bootstrap/Col'; 
import   Button   from 'react-bootstrap/Button'; 
import { BsFilter  } from "react-icons/bs";

import ExploreJobSalaryFilter from  './ExploreJobSalaryFilter';
import ExploreJobLocationFilter from  './ExploreJobLocationFilter';
import ExploreJobEmploymentTypeFilter from  './ExploreJobEmploymentTypeFilter';
import ExploreJobWorkFromHomeFilter from  './ExploreJobWorkFromHomeFilter';

const ExploreJobFilters= ( ) => { 
  const [filterStatus, setFilterStatus] = useState(false);
	
	
	const handleHideShowFilter = useCallback(( ) => { 
    setFilterStatus((pre) => !pre);
  }, [  ]);

	return ( 
		<Row className="justify-content-center p-0 m-0 py-2">
        <Col xs={12} sm={12} md={12} lg={10} xl={8} xxl={8} 
				className=" p-0  " 
				 
				>
				 
						<Button  
						variant="light"
						className={`border-0 px-3   py-2 d-flex gap-2 align-items-center  mb-1 `}
						title={`Filter ${filterStatus ? "Open" : "Close"}`}
						id={`Filter-${filterStatus ? "Open" : "Close"}`}
						onClick={handleHideShowFilter}>
						
						<BsFilter className="fs-5" style={{ strokeWidth: '0.5',  }}/> <strong >Filters</strong>
						
						</Button>
					 
				</Col> 
				<Col xs={12} sm={12} md={12} lg={10} xl={8} xxl={8} 
				className={`sub_main_container  filter-container  p-0      d-sm-flex flex-wrap  justify-content-center  ${filterStatus ? "collapsed" : "expanded"}`} 
				 
				>
					 
          <ExploreJobSalaryFilter  />
          <ExploreJobLocationFilter />
          <ExploreJobEmploymentTypeFilter />
          <ExploreJobWorkFromHomeFilter />
					
        </Col>
      </Row>
	);
};

export default ExploreJobFilters;
