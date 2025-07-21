import { memo, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import TextEditor from '../../Common/TextEditor';   

const UploadNewPostDescription = ({ description, setDescription }) => {
  const handleDescription = useCallback((value) => {
    setDescription(value);
  }, [setDescription]);

  return (
    <Form.Group controlId="PostDescription" className="pt-3">
      <Form.Label className="py-1 h6">Description</Form.Label>
      <TextEditor
        value={description}
        onChange={handleDescription}
        className="custom-text-box"
        placeholder="Write your post description..."
      />
    </Form.Group>
  );
};

export default memo(UploadNewPostDescription);
