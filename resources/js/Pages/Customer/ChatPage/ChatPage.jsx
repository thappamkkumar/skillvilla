import {useState, memo} from 'react'; 
import { useParams, Outlet } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 

import ChatList from "../../../Components/Customer/ChatList/ChatList";
import ChatBoxPage from "./ChatBoxPage";
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data 
  
import useIsSmallScreen from '../../../CustomHook/useIsSmallScreen';

const ChatPage = () => { 
	const { chatId } = useParams(); 
  const isSmallScreen = useIsSmallScreen();//custom hook for check the screen width	
	 
  return (
		<>
			<PageSeo 
					title="Your Chats | SkillVilla"
					description="View all your active conversations, connect with other professionals, and keep the discussion going."
					keywords="chats, messages, direct messaging, conversations, communication"
				/>

			<Row className="w-100 p-0 m-0 h-100 " >
        <Col md={4} xxl={3} className=" p-0 m-0 h-100 border-end overflow-auto" > 
					
				 <ChatList chatId={chatId} />  
        </Col>
				
				{
					isSmallScreen==false && (
						<Col sx={0} sm={0} md={8} xxl={9} className="d-none d-md-block p-0 m-0 h-100    ">
            <Outlet />
						{chatId == null && 
								<div className="w-100 h-100 d-flex justify-content-center align-items-center">
									<h5 className="text-center">No chat selected. Please choose a user to begin chatting.</h5>
								</div>
						}
        </Col>
					)
				}
        
      </Row>
    </> 
  );
};

export default  memo(ChatPage);
