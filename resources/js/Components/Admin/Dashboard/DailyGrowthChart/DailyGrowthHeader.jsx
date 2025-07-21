import { memo } from "react";
import { Dropdown } from "react-bootstrap";

const DailyGrowthHeader = ({  
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth
}) => {
    
    // Month list with numbers
    const months = [
        { name: "January", value: 1 },
        { name: "February", value: 2 },
        { name: "March", value: 3 },
        { name: "April", value: 4 },
        { name: "May", value: 5 },
        { name: "June", value: 6 },
        { name: "July", value: 7 },
        { name: "August", value: 8 },
        { name: "September", value: 9 },
        { name: "October", value: 10 },
        { name: "November", value: 11 },
        { name: "December", value: 12 },
    ];

    // Generate a list of years from 2000 to the current year (ascending order)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);

    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            {/* Heading (Left Side) */}
            <h5 className="pe-3">Daily</h5>

            {/* Inputs (Right Side) */}
            <div className="d-flex gap-2">
                
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

                {/* Month Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="light" className=" ">
                        {months.find(m => m.value === selectedMonth)?.name || "Select Month"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="  p-2" style={{height:'40vh', overflow:'auto'}}>
                        {months.map((month) => (
                            <Dropdown.Item 
                                key={month.value} 
																as="button"
                                onClick={() => setSelectedMonth(month.value)}
																id={`monthSelectorBTN${month.value}`}
																title={`Select month ${month.name}`}
																className="navigation_link  rounded  py-2"
                            >
                                {month.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default memo(DailyGrowthHeader);
