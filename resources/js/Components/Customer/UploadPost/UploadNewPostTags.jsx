import { memo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { BsX } from 'react-icons/bs';

const UploadNewPostTags = ({tags, setTags}) => {
  const [newTags, setNewTags] = useState('');
   

  // Handle adding a tag to the tags array
  const handleAddTags= () => {
    const trimmedTags= newTags.trim(); // Trim the input value
    if (trimmedTags && !tags.includes(trimmedTags)) {
      setTags((prev) => [...prev, trimmedTags]); // Add tag
      setNewTags(''); // Clear the input field
    }
  };

  // Handle removing a tag from the categories array using its index
  const handleRemoveTags = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index)); // Remove Tags by index
  };

  return (
    <div className="pt-3">
      <Form.Group className="py-2" controlId="PostTags">
        <Form.Label className="py-1 h6">Tags</Form.Label>
				
				{/* Display selected Tags */}
				{tags.length > 0 && (
					<div className="d-flex flex-wrap gap-2 pb-2 tech_skill_container">
						{tags.map((tag, index) => (
							<div key={`${tag}-${index}`} className="d-flex gap-3 align-items-center  p-1 px-2   rounded tech_skill">
								<span className="pe-3">{tag}</span>
								<Button
									variant="danger"
									title={`Remove tag ${tag}`}
									id={`removeTag${index}`}
									className="p-0   lh-1   "
									onClick={() => handleRemoveTags(index)} // Call the function to remove the tag
								>
									<BsX className="fs-5" style={{ strokeWidth: '1.5' }} />
								</Button>
							</div>
						))}
					</div>
				)}
				
				
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Add a tag"
            className="shadow-none bg-light me-2 rounded formInput"
            name="tag"
            autoComplete="off"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)} // Update the newTag state
          />
          <Button
            variant="secondary"
            id="addTagBTN"
            title="Add tag"
            className="rounded   "
            onClick={handleAddTags} // Call the function to add a tag
          >
            Add
          </Button>
        </InputGroup>
      </Form.Group>

      
    </div>
  );
};

export default memo(UploadNewPostTags);
