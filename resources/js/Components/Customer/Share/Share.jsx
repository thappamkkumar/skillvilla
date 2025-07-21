 
import {memo, useState,   useCallback  } from 'react';
import {useSelector, useDispatch } from 'react-redux';   
import Button from 'react-bootstrap/Button';  
import Offcanvas from 'react-bootstrap/Offcanvas'; 
import Card from 'react-bootstrap/Card';  

import {   BsX,    } from 'react-icons/bs'; 
  
import ShareHeader from './Header/ShareHeader';
import UserList from './UserList/UserList';
import ShareWithUser from './UserList/ShareWithUser';
import CommunityList from './CommunityList/CommunityList';
import ShareWithCommunity from './CommunityList/ShareWithCommunity';

import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';
   

const Share = () => { 
	
 const shareStats = useSelector((state) => state.shareStats); //selecting token from store
 const [selectedList, setSelectedList] = useState('user');
 const [selectedUsers, setSelectedUsers] = useState([]);
 const [selectedCommunities, setSelectedCommunities] = useState([]);
 	const dispatch = useDispatch();
 
	 
  //function for handling share page hide and show
	const handleCloseShareBox  = useCallback(()=>{
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: null}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: ""}));
	}, []);
	
	return ( 
		 
       
			<Offcanvas placement="bottom" show={shareStats.selectedId != null} onHide={handleCloseShareBox} className=" bg-white rounded comment_box_main_Container mx-auto h-100 " >
        
				  
				<Offcanvas.Body  className="  overflow-auto    p-0  mx-0  " >
				
					<Card    className="w-100 h-100  border-0   overflow-hidden  p-0 rounded-0  ">
						
						<Card.Header className="bg-white  d-flex gap-2 align-items-start justify-content-between border-0 " >
						
							<h4 className="fs-4">Share</h4>
							<Button  variant="outline-dark" className=" p-1    border border-2 border-dark  " onClick={handleCloseShareBox}  id="closeShareBoxBTN" title="Close share box"  >
									<BsX className="  fw-bold fs-3 " /> 
							</Button>
							
						</Card.Header>
 
						<Card.Body  className="chatBox_body   p-0  py-2 overflow-auto    " > 
					 
							<ShareHeader setSelectedList={setSelectedList} />
							
							{
								selectedList == 'user' ?
								<>
									<UserList selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
									
								</>
								:
								<CommunityList selectedCommunities={selectedCommunities} setSelectedCommunities={setSelectedCommunities} />
							}
					 	</Card.Body>

									 
						<Card.Footer   className="chatBox_footer border-0 py-2 px-2 w-100  "  	>
							{
								selectedList == 'user'  
								?  
								<ShareWithUser selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
								:
								<ShareWithCommunity  selectedCommunities={selectedCommunities} setSelectedCommunities={setSelectedCommunities} />
							}
						</Card.Footer>
					</Card>
		
					
        </Offcanvas.Body>
         
				
      </Offcanvas>			
		 
	);
	
};

export default memo(Share);
