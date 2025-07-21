import { memo } from "react";
import { Dropdown } from "react-bootstrap";

const YearlyGrowthHeader = ({  
    selectedYear, 
    setSelectedYear, 
}) => {
    
     
    // Generate a list of years from 2000 to the current year (ascending order)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);

    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            {/* Heading (Left Side) */}
            <h5 className="pe-3">Monthly</h5>

                
						{/* Year Dropdown */}
						<Dropdown>
								<Dropdown.Toggle variant="light" className=" ">
										{selectedYear}
								</Dropdown.Toggle>
								<Dropdown.Menu className="p-2 "
								style={{height:'40vh', overflow:'auto'}}
								>
										{years.map((year) => (
												<Dropdown.Item 
														as="button"
														key={year} 
														onClick={() => setSelectedYear(year)}
														id={`yearSelectorBTN${year}`}
														title={`Select year ${year}`}
														className="navigation_link  rounded  py-2"
												>
														{year}
												</Dropdown.Item>
										))}
								</Dropdown.Menu>
						</Dropdown>

                 
        </div>
    );
};

export default memo(YearlyGrowthHeader);
