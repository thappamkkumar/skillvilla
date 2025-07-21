import React from "react";
import { Button } from "react-bootstrap"; 

const PaginationControls = ({ 
prevPageUrl, 
nextPageUrl,
onPageChange,

}) => {
  return (
    <div className="d-flex gap-3 justify-content-center align-items-center">
      {/* Previous Button */}
      <Button
        variant="secondary"
        onClick={() => onPageChange(prevPageUrl)}
				id="previousDataBTN"
				title="Previous"
        disabled={!prevPageUrl}
				style={{ minWidth: "140px", maxWidth: "180px", width: "100%" }}
      >
        Previous
      </Button>

       
      {/* Next Button */}
      <Button
        variant="secondary"
        onClick={() => onPageChange(nextPageUrl)}
        disabled={!nextPageUrl}
				id="nextDataBTN"
				title="Next"
				style={{ minWidth: "140px", maxWidth: "180px", width: "100%" }}
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;
