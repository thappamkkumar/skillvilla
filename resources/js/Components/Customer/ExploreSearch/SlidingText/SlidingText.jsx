import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";

const SlidingText = ({toggleSearchInput}) => {
	const texts = [
		'Search "Jobs"',
		'Search "Freelancers"',
		'Search "Freelancer Works"',
    'Search "User"',
    'Search "Company"',		
    'Search "User Workfolios"',
    'Search "Problems"',
    'Search "Problem Solutions"',
    'Search "Posts"', 
    'Search "live users"',
  ]; // Array of texts to display

  const [currentIndex, setCurrentIndex] = useState(0); // Current text index

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length); // Move to the next text
    }, 5000); // Stay for 5 seconds for each text

    return () => clearInterval(interval); // Cleanup interval
  }, [texts.length]);

  return (
    <div 
			className="slidingTextContainer flex-fill d-flex align-items-center py-2  "
			onClick={toggleSearchInput}
		>
      <BsSearch className="me-2" />
      <div className="textWrapper flex-fill ">
        <span key={currentIndex} className="slidingText">
          {texts[currentIndex]}
        </span>
      </div>
    </div>
  );
};

export default SlidingText;
