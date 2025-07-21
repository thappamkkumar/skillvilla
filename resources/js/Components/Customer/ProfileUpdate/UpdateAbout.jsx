import { memo, useState } from 'react';
import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import TextEditor from '../../Common/TextEditor';

const UpdateAbout = ({ userProfileData, handleUserAboutUpdate }) => { 
  const { about } = userProfileData;
  const [changedAbout, setChangedAbout] = useState(about);

  const handleAboutChange = (val) => { 
    setChangedAbout(val);
  };

  const submitChangedAbout = () => { 
    handleUserAboutUpdate(changedAbout);   
  };

  return ( 
    <div>
		
      <TextEditor
        value={changedAbout}
        onChange={handleAboutChange}
        className="custom-text-box"
        placeholder="Write something about you..."
      />
      <Button
        variant="dark"
        title="Update about yourself."
        className="mt-3 px-3"
        id="submitFormButton"
        onClick={submitChangedAbout}
      >
        Update 
      </Button>
    </div>
  );
};

export default memo(UpdateAbout);
