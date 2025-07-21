import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Spinner from "react-bootstrap/Spinner";
import LoadMoreButton from './LoadMoreButton'; 

const InfiniteScrollContainer = ({
	 
  fetchData, // Function to fetch data
  hasMore, // Boolean indicating if more data is available
	loading, //state to hold loading or not
  initialScrollPosition, // Initial scroll position
	onScrollUpdate, // to update current scroll position
	style = null, //to add custom style and default null becasue some component not need it
  children, // Render children
}) => {
  
  const scrollRef = useRef(null);
	const timeoutId = useRef(null); // Store the timeout ID for cleanup
	const isFirstRender = useRef(true); // Track first render

  // Set initial scroll position on mount
   useEffect(() => {
			if (isFirstRender.current && scrollRef.current && initialScrollPosition) {
			timeoutId.current = setTimeout(() => { 
					scrollRef.current.scrollTop = initialScrollPosition;
					isFirstRender.current = false; 
					
				}, 500); // Adjust timeout as needed (100ms for example)
			}

			// Cleanup timeout on component unmount
			return () => {
				if (timeoutId.current) {
					clearTimeout(timeoutId.current);
				}
			};
    
  }, [initialScrollPosition]); 

  // Fetch more data when reaching the bottom
  const fetchMoreData = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
          fetchData();
      }
    }
  }, [fetchData, loading, hasMore]);

  // Debounced scroll position update
  const handleScroll = _.debounce(() => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
        onScrollUpdate(scrollTop);
     // console.log('s');
    }
  }, 0);

  // Add scroll event listener
  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
				let source2 = axios.CancelToken.source(); 
      ref.addEventListener("scroll", fetchMoreData);
       
      return () => {
        ref.removeEventListener("scroll", fetchMoreData);
        // Cancel the request when the component unmounts 
        source2.cancel('Request canceled due to component unmount '); 
      };
    }
  }, [fetchMoreData]);
	
  useEffect(() => {
    const ref = scrollRef.current;
		if (ref) { 
      ref.addEventListener("scroll", handleScroll);
      return () => { 
        ref.removeEventListener("scroll", handleScroll);
        handleScroll.cancel();
      };
    } 
  }, [ handleScroll]);

  return (
    <div ref={scrollRef} className={` ${style != null ? style : 'pb-5  pt-3  main_container'}`}>
      {children}
			
			{hasMore && !loading && (
				<LoadMoreButton apiCall={fetchData}  loading={loading} />
			)}	
			
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" size="md" />
        </div>
      )}
    </div>
  );
};

InfiniteScrollContainer.propTypes = {
  fetchData: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  initialScrollPosition: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default InfiniteScrollContainer;
