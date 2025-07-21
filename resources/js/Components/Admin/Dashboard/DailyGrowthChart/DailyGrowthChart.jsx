import { memo,useState, useCallback, useEffect, useRef  } from "react";
import {useSelector } from 'react-redux'; 
import   Dropdown   from "react-bootstrap/Dropdown"; 
import   Spinner   from "react-bootstrap/Spinner"; 

import DailyGrowthHeader from './DailyGrowthHeader'; 
import GrowthChart from '../GrowthChart/GrowthChart'; 

import serverConnection from '../../../../CustomHook/serverConnection';
 
const DailyGrowthChart = ({ 
dailyGrowth,
setDailyGrowth,
}) => {
		const authToken = useSelector((state) => state.auth.token); //selecting token from store
		const firstRender = useRef(false);
		const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
 
    const [selectedChart, setSelectedChart] = useState('user');
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [loading, setLoading] = useState(false);
		const charts = {
				user: (
						<GrowthChart 
								title="Users Growth" 
								labels={dailyGrowth.map(item => item.day)} 
								data={dailyGrowth.map(item => item.users)} 
								borderColor="rgba(44, 62, 80, 1)"        // Dark Navy
								backgroundColor="rgba(44, 62, 80, 0.2)" 
								pointColor="rgba(44, 62, 80, 1)"
						/>
				),
				post: (
						<GrowthChart title="Posts Growth" 
								labels={dailyGrowth.map(item => item.day)} 
								data={dailyGrowth.map(item => item.posts)} 
								borderColor="rgba(55, 71, 79, 1)"       // Dark Gray Blue
								backgroundColor="rgba(55, 71, 79, 0.2)"
								pointColor="rgba(55, 71, 79, 1)"
						/>
				),
				jobs: (
						<GrowthChart title="Jobs Growth"
								labels={dailyGrowth.map(item => item.day)}
								data={dailyGrowth.map(item => item.jobs)} 
								borderColor="rgba(69, 90, 100, 1)"      // Muted Steel Blue
								backgroundColor="rgba(69, 90, 100, 0.2)"
								pointColor="rgba(69, 90, 100, 1)"
						/>
				),
				freelance: (
						<GrowthChart title="Freelance Growth" 
								labels={dailyGrowth.map(item => item.day)} 
								data={dailyGrowth.map(item => item.freelance)} 
								borderColor="rgba(84, 110, 122, 1)"     // Deep Slate
								backgroundColor="rgba(84, 110, 122, 0.2)"
								pointColor="rgba(84, 110, 122, 1)"
						/>
				),
				community: (
						<GrowthChart title="Community Growth" 
								labels={dailyGrowth.map(item => item.day)} 
								data={dailyGrowth.map(item => item.community)} 
								borderColor="rgba(38, 50, 56, 1)"      // Midnight Gray
								backgroundColor="rgba(38, 50, 56, 0.2)"
								pointColor="rgba(38, 50, 56, 1)"
						/>
				),
				problem: (
						<GrowthChart title="Problem Growth" 
								labels={dailyGrowth.map(item => item.day)} 
								data={dailyGrowth.map(item => item.problem)} 
								borderColor="rgba(183, 28, 28, 1)"      // Subtle Dark Red
								backgroundColor="rgba(183, 28, 28, 0.2)"
								pointColor="rgba(183, 28, 28, 1)"
						/>
				),
				workfolio: (
						<GrowthChart title="Workfolio Growth" 
								labels={dailyGrowth.map(item => item.day)} 
								data={dailyGrowth.map(item => item.workfolio)} 
								borderColor="rgba(96, 125, 139, 1)"     // Cool Blue-Gray
								backgroundColor="rgba(96, 125, 139, 0.2)"
								pointColor="rgba(96, 125, 139, 1)"
						/>
				),
				company: (
						<GrowthChart title="Company Growth" 
								labels={dailyGrowth.map(item => item.day)} 
								data={dailyGrowth.map(item => item.company)} 
								borderColor="rgba(33, 33, 33, 1)"      // Pure Black
								backgroundColor="rgba(33, 33, 33, 0.2)"
								pointColor="rgba(33, 33, 33, 1)"
						/>
				),
		};

		// Chart options
    const chartOptions = [
       { key: "user", label: "Users Growth" },
        { key: "post", label: "Posts Growth" }, 
				{ key: "company", label: "Company Growth" },
        { key: "jobs", label: "Jobs Growth" },
        { key: "freelance", label: "Freelance Growth" },
        { key: "community", label: "Community Growth" },
        { key: "workfolio", label: "Workfolio Growth" },
        { key: "problem", label: "Problem Growth" },
    ];

    // Get the label of the currently selected chart
    const currentChartLabel = chartOptions.find((opt) => opt.key === selectedChart)?.label || "Select Chart";

		
		 
    const fetchGrowthData = useCallback(async () => {
        try {
						if(authToken == null){return}
           
					 setLoading(true); 
						
						const requestData = {
                year_daily: selectedYear,
                month_daily: selectedMonth,
            };
						
						const resultData = await serverConnection('/admin/get-dashboard-info', requestData, authToken);
					
						//console.log(resultData);						
						if( resultData != null &&  resultData.status == true )
						{ 
							if(resultData.dailyGrowth)
							{
								setDailyGrowth(resultData.dailyGrowth);
							}
							
						}
						
             
        } catch (error) {
           // console.error("Error fetching growth data:", error);
        } finally {
            setLoading(false);
        }
    }, [authToken, selectedYear, selectedMonth, setDailyGrowth]); 

     
    useEffect(() => {
				if(firstRender.current)
				{
					fetchGrowthData();
				}
				firstRender.current = true;
				
    }, [fetchGrowthData, selectedYear, selectedMonth]);  

		
		
		
    return (
        <div className="sub_main_container rounded	p-2 p-sm-3 p-md-4 p-lg-2 p-xl-3"
				style={{ height: "auto", minHeight: "40vh" }}>
				 
           <DailyGrowthHeader  
						selectedYear={selectedYear}
						selectedMonth={selectedMonth}
						setSelectedYear={setSelectedYear}
						setSelectedMonth={setSelectedMonth}
						/>
						
						<Dropdown className="mb-3 p-0">
								<Dropdown.Toggle variant="light" className="fs-4 fw-bold w-100   d-flex justify-content-between align-items-center">
										<span>{currentChartLabel}</span> {/* Left-aligned text */}
										<span className="dropdown-toggle-icon"></span>
								</Dropdown.Toggle>

								<Dropdown.Menu>
										{chartOptions.map((option) => (
												<Dropdown.Item 
												as="button"
												key={option.key} 
												onClick={() => setSelectedChart(option.key)}
												id={`categorySelectorBTN${option.key}`}
												title={`Select ${option.label} chart`}
												className="navigation_link  rounded  py-2"
												>
														{option.label}
												</Dropdown.Item>
										))}
								</Dropdown.Menu>
						</Dropdown>
						
						{/* Render the selected chart */}
						{ 
							loading ?
							(
								<div className="text-center">
									<Spinner size="md" />
								</div>
							):(
								<>{charts[selectedChart]}</>
							)
				
						}
					
            
								
								
        </div>
    );
};

export default memo(DailyGrowthChart);
