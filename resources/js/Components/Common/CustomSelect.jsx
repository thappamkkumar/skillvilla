import React, { useState } from "react";

const CustomSelect = ({ children, onSelect, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onSelect) {
      onSelect(value); // Pass the selected value to the parent component
    }
  };

  const styles = {
    container: {
      position: "relative",
      width: "250px",
      marginBottom: "20px",
    },
    button: {
      width: "100%",
      padding: "10px",
      background: "#f9f9f9",
      border: "1px solid #ccc",
      borderRadius: "4px",
      textAlign: "left",
      cursor: "pointer",
      fontSize: "16px",
    },
    buttonHover: {
      backgroundColor: "#e6f7ff",
      borderColor: "#007bff",
    },
    options: {
      position: "absolute",
      top: "100%",
      left: "0",
      width: "100%",
      background: "white",
      border: "1px solid #ccc",
      borderRadius: "4px",
      
      listStyle: "none",
      margin: "0",
      padding: "0",
      maxHeight: "200px",
      overflowY: "auto",
    },
    option: {
      padding: "10px",
      cursor: "pointer",
    },
    optionHover: {
      backgroundColor: "#e6f7ff",
    },
  };

  return (
    <div style={styles.container}>
      <button
        type="button"
        style={styles.button}
        onClick={toggleDropdown}
      >
        {selectedValue || placeholder}
      </button>
      {isOpen && (
        <ul style={styles.options}>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { onOptionClick: handleOptionClick })
          )}
        </ul>
      )}
    </div>
  );
};

export const CustomOption = ({ value, children, onOptionClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    option: {
      padding: "10px",
      cursor: "pointer",
      backgroundColor: isHovered ? "#e6f7ff" : "white",
    },
  };

  return (
    <li
      style={styles.option}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOptionClick(value)}
    >
      {children}
    </li>
  );
};

export default CustomSelect;
