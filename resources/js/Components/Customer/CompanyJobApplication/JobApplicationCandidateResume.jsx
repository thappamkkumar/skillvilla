import {useState,useCallback} from "react";
import { useSelector } from 'react-redux';
import  Button  from 'react-bootstrap/Button'; 
import  Spinner  from 'react-bootstrap/Spinner'; 
 import { BsEye, BsDownload} from "react-icons/bs"; 

import PdfReaderBox from '../../Common/PdfReaderBox';
import downloadFile from '../../../CustomHook/downloadFile';
const JobApplicationCandidateResume = ({applicationId, resume }) => {
	const authToken = useSelector((state) => state.auth.token); // Selecting token from store
	const [loading, setLoading]=useState(false);
	 
	const [pdfReaderBox,serPdfReaderBox] = useState(false);
	
	//toggle pdf box
	const handlePdfReaderBox = useCallback(()=>{
		serPdfReaderBox((pre)=>(!pre));
	},[]);
	
	// Function to handle downloading resume
  const handleDownloadResume= useCallback(async () => {
    try {
			setLoading(true);
      await downloadFile(applicationId, resume, '/download-resume', authToken);
			setLoading(false);
    } catch (error) {
			setLoading(false);
      //console.error('Error downloading file:', error);
    }
  }, [authToken]);
  return (
	<>
    <div className="d-flex flex-wrap justify-content-center gap-3 py-5">
			<Button variant="light" 
			id="viewResume" 
			title="View resume"
			className="  px-5"
			onClick={handlePdfReaderBox}
			>
				<BsEye className="me-2"/> View Resume
			</Button>
			<Button variant="dark"  
			id="downloadResume" 
			title="Download resume"
			className="  px-5"
			onClick={handleDownloadResume}
			>
				{
					loading?( <Spinner  animation="border"  size="sm" />):(<> <BsDownload style={{ strokeWidth: '1.2' }}  /> Download Resume</>)
				}
				 
			</Button>
    </div>
		<PdfReaderBox 
			heading={'Resume'}
			file={resume}
			pdfReaderBox={pdfReaderBox}
			handlePdfReaderBox ={handlePdfReaderBox}  
		/>
		 
	</>
  );
};

export default JobApplicationCandidateResume;
