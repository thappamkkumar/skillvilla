import React from "react";
import { Line } from "react-chartjs-2";
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    LineElement, 
    PointElement, 
    Title, 
    Tooltip, 
    Legend, 
    Filler  
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const GrowthChart = ({ 
    title, 
    labels, 
    data, 
    borderColor = "rgba(54, 162, 235, 1)",  // Default Blue Line
    backgroundColor = "rgba(54, 162, 235, 0.2)", // Default Light Blue Fill
    pointColor = "rgba(54, 162, 235, 1)" // Default Blue Point Color
}) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    const formattedData = {
        labels: labels, 
        datasets: [
            {
                label: title,
                data: data,
                borderColor: borderColor, // Custom Line color
                backgroundColor: backgroundColor, // Custom Fill color
                pointBackgroundColor: pointColor, // Custom Point color
                pointBorderColor: "#fff",
                fill: true, 
                tension: 0.4, // Smooth line
            },
        ],
    };

    return (
        <div className="chart-container">
            <Line data={formattedData} />
        </div>
    );
};

export default GrowthChart;
