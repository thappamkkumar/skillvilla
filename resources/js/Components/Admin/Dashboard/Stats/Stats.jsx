import React from "react";
import { FaUser, FaRegNewspaper, FaBriefcase, FaTasks, FaUsers, FaChartLine, FaExclamationTriangle, FaCamera, FaBuilding } from "react-icons/fa";

const iconMap = {
    "Users": <FaUser size={28} />,
    "Posts": <FaRegNewspaper size={28} />,
    "Jobs": <FaBriefcase size={28} />,
    "Freelance": <FaTasks size={28} />,
    "Communities": <FaUsers size={28} />,
    "Workfolio": <FaChartLine size={28} />,
    "Problem": <FaExclamationTriangle size={28} />,
    "Stories": <FaCamera size={28} />,
    "Companies": <FaBuilding  size={28} />,
};

// Dark, Elegant Colors
const colorMap = {
    "Users": "linear-gradient(135deg, #2C3E50, #1A252F)",       // Dark Navy
    "Posts": "linear-gradient(135deg, #37474F, #263238)",       // Dark Gray Blue
    "Jobs": "linear-gradient(135deg, #455A64, #37474F)",        // Muted Steel Blue
    "Freelance": "linear-gradient(135deg, #546E7A, #3A4857)",   // Deep Slate
    "Communities": "linear-gradient(135deg, #263238, #1A1A1A)",// Midnight Gray
    "Workfolio": "linear-gradient(135deg, #1E293B, #111827)",   // Rich Charcoal
    "Problem": "linear-gradient(135deg, #B71C1C, #7E191B)",     // Subtle Dark Red
    "Stories": "linear-gradient(135deg, #607D8B, #455A64)",     // Cool Blue-Gray
    "Companies": "linear-gradient(135deg, #212121, #111111)",   // Pure Black
};

const Stats = ({ heading, total }) => {
    return (
        <div style={{
            background: colorMap[heading],
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease-in-out",
            cursor: "pointer"
        }}
        className="stats-card"
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
            <div>
                <h4>{heading}</h4>
                <h2>{total}</h2>
            </div>
            <div>
                {iconMap[heading]}
            </div>
        </div>
    );
};

export default Stats;
