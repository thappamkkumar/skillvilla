import { useEffect,   useCallback  } from 'react';  
import _ from "lodash";


import {updateCommunityMessageState} from '../../../../StoreWrapper/Slice/CommunityMessageSlice';


const useHandleScrollPosition = (firstRender, showScrollDownBTN, setShowScrollDownBTN, newMessages, messageList, scrollRef, communityId, dispatch ) => { 



   //add  scroll height on first  time rendering
/*	useEffect(()=>{
		if(scrollRef != null)
		{
			let initialPosition = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
			dispatch(updateCommunityMessageState({type : 'SetScrollHeight', scrollHeight: initialPosition})); 
			scrollRef.current.scrollTop = initialPosition;
			
		}
	},[communityId, dispatch]);*/
useEffect(() => {
    if (scrollRef.current) { 
        if (firstRender.current === 0) {  
            setTimeout(() => {
                if (messageList.scrollHeightPosition === 0) { 
                    let initialPosition = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
                    dispatch(updateCommunityMessageState({ type: 'SetScrollHeight', scrollHeight: initialPosition })); 
                    scrollRef.current.scrollTop = initialPosition;  
                } else { 
                    scrollRef.current.scrollTop = messageList.scrollHeightPosition;
                }
            }, 100); // Small delay to ensure the DOM has settled
            
            firstRender.current++;
        }
    }
}, [communityId, dispatch, messageList.scrollHeightPosition]);

	
	
	
	
	
	// whenever mesageList state change it adjust scroll postion
	useEffect(()=>{
		   
		if(Object.keys(messageList.messageList).length <= 0)
		{
			return;
		}
		 
		if(scrollRef != null)
		{
			
			const prevHeight = messageList.scrollHeight;
			const newHeight = scrollRef.current.scrollHeight;
			const clientHeight = scrollRef.current.clientHeight;
			
			if(prevHeight < newHeight && scrollRef.current.scrollTop == 0 )
			{
				if( firstRender.current == 0)
				{  
					if(messageList.scrollHeightPosition == 0)
					{
						scrollRef.current.scrollTop  = newHeight - clientHeight;
					}
					else
					{
						scrollRef.current.scrollTop  = messageList.scrollHeightPosition;
					}
					 firstRender.current++;
				}
				else
				{ 
					 
						const scrollHeightOffset = newHeight - prevHeight;
						scrollRef.current.scrollTop  = scrollHeightOffset;
					
				}
				 
				dispatch(updateCommunityMessageState({type : 'SetScrollHeight', scrollHeight:newHeight}));
			}
			if(newMessages.current)
			{
				scrollRef.current.scrollTop  = newHeight - clientHeight;
				newMessages.current = false;
				
			}
		  
 		}
		 
	},[messageList.messageList, ]);
	
	  
		
		
		
		
	
 
	
	
	
	
		
	
	const ToggleScrolDownBTN = useCallback(()=>{
		if (scrollRef.current) 
		{
			const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
       
			const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
 
			// Update state only if the value actually changes
			 if (isAtBottom && showScrollDownBTN) {
					setShowScrollDownBTN(false);  
			} else if (!isAtBottom && !showScrollDownBTN) {
					setShowScrollDownBTN(true);  
			} 
		}
		
	},[showScrollDownBTN]);
	
	
	
  
	// Debounced scroll position update in redux state
  const handleScrollPosition = _.debounce(() => { 
    if (scrollRef.current) 
		{
      const scrollTop = scrollRef.current.scrollTop;
      dispatch(updateCommunityMessageState({type : 'SetScrollHeightPosition', scrollHeightPosition:scrollTop}));
			
    }
  }, 500);
	
	
	
	
	// Single event handler function to avoid creating new instances
		const handleScrollEvent = () => {
				handleScrollPosition();
			 	ToggleScrolDownBTN();
		};
		
		
		
		
	//add scroll event listen to get scroll position
	useEffect(() => {
    const ref = scrollRef.current;
    if (ref) { 
      ref.addEventListener("scroll", handleScrollEvent);
      return () => { 
        ref.removeEventListener("scroll", handleScrollEvent);
        handleScrollPosition.cancel();
      };
    }
  }, [ handleScrollPosition, ToggleScrolDownBTN]);
	
	
	
};

export default useHandleScrollPosition;
