 
import {memo, useRef, useCallback} from 'react';
import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import { BsX } from 'react-icons/bs'; 


const UpdateSkillsOrTechnology = ({interest, removeInterest, addInterest}) => { 

	const newInterestRef = useRef('');
	//console.log(interest); 
	const handleNewInterestEnter = useCallback((event)=>{
		newInterestRef.current.value = event.target.value;
	}, []);
	
	const handleInterestSubmit = useCallback((event)=>{
		if(newInterestRef.current.value.length == 0)
		{
			return;
		}
		
		addInterest(newInterestRef.current.value);
		newInterestRef.current.value = '';
	}, [ ]);
	
	return ( 
	
		<div  > 
			<div className="d-inline-flex flex-wrap tech_skill_container">	
				{
					interest != null && interest.map((tech, index) => ( 
						<span key={index} className="border border-0 mx-1 my-1 p-1 px-2   rounded tech_skill">
							
							<span className="pe-3">{tech}</span>
							 
							<Button variant="danger" title={`remove ${tech} from interest`} id={`removeInterestBTN${index}`} className="p-0 mb-1 tech_skill_remove_btn"  onClick={()=>{removeInterest(index)}} ><BsX className="  fs-5" style={{ strokeWidth: '1.5',  }}/></Button>
							 
						</span>
					))
				} 
				 
			</div>	
			<Row className="p-0 py-2  m-0    ">
				
				<Col xs={8} sm={8} lg={4} className=" p-0    ">
					<Form.Group   controlId="formInterest"   > 
						<Form.Control type="text"  placeholder="Enter interest here..." ref={newInterestRef}  className="   shadow-none   formInput" name="interest" onChange={handleNewInterestEnter} autoComplete="off"  /> 
					</Form.Group>	
				</Col> 	 
				<Col xs={4} sm={4} lg={2} className="  ">
					<Button variant="*" title="add interest" id="addInterestBTN" className="   primaryBTN " onClick={handleInterestSubmit} >Add More</Button>
				</Col> 
			</Row>	
		</div>
	);
	
};

export default memo(UpdateSkillsOrTechnology);
