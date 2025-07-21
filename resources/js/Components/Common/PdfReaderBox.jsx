 
 import  Offcanvas  from 'react-bootstrap/Offcanvas'; 
const PdfReaderBox = ({ 
	heading,
	file, 
	pdfReaderBox,
	handlePdfReaderBox, 
	
	}) => {
	 
 
  return (
	
		<Offcanvas  placement="bottom"  show={pdfReaderBox} onHide={handlePdfReaderBox} className=" bg-white rounded  comment_box_main_Container  " style={{  left:'50%',transform: 'translateX(-50%)', height:'98vh'}} >
				<Offcanvas.Header closeButton>
          <Offcanvas.Title>{heading}</Offcanvas.Title>
        </Offcanvas.Header>
				<Offcanvas.Body className="p-0"   > 
				 <embed src={file} width="100%" height="600" type="application/pdf" />
					  
					
				</Offcanvas.Body> 
			</Offcanvas>
	 
  );
};

export default PdfReaderBox;
