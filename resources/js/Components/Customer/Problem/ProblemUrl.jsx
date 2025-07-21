import  { memo } from 'react'; 
import  Button  from 'react-bootstrap/Button'; 

const ProblemUrl= ({ url, problem_id, title }) => {
  
 const handleOpenUrl = ( ) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div className=" ">
      <h4>External Url</h4>
      <div  className=" ">
				<Button
					variant="link"
					id={`externalURL${problem_id}`}
					title={`external url for problem "${title}".`}
					onClick={() => handleOpenUrl( )}
					className="p-0 m-0 text-decoration-none post_tags"
				>
					{url}
				</Button>
			</div>
    </div>
  );
};

export default memo(ProblemUrl);
