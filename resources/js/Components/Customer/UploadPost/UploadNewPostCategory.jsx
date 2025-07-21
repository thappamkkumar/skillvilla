import { memo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { BsX } from 'react-icons/bs';

const UploadNewPostCategory = ({categories, setCategories}) => {
  const [newCategory, setNewCategory] = useState('');
   

  // Handle adding a category to the categories array
  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim(); // Trim the input value
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      setCategories((prevCategories) => [...prevCategories, trimmedCategory]); // Add category
      setNewCategory(''); // Clear the input field
    }
  };

  // Handle removing a category from the categories array using its index
  const handleRemoveCategory = (index) => {
    setCategories((prevCategories) => prevCategories.filter((_, i) => i !== index)); // Remove category by index
  };

  return (
    <div className="pt-3">
      <Form.Group className="py-2" controlId="PostCategory">
        <Form.Label className="py-1 h6">Category</Form.Label>
				
				{/* Display selected categories */}
				{categories.length > 0 && (
					<div className="d-flex flex-wrap gap-2 pb-2 tech_skill_container">
						{categories.map((category, index) => (
							<div key={`${category}-${index}`} className="d-flex gap-3 align-items-center  p-1 px-2   rounded tech_skill">
								<span className="pe-3">{category}</span>
								<Button
									variant="danger"
									title={`Remove category ${category}`}
									id={`removeCategory${index}`}
									className="p-0   lh-1   "
									onClick={() => handleRemoveCategory(index)} // Call the function to remove the category
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
            placeholder="Add a category"
            className="shadow-none bg-light me-2 rounded formInput"
            name="category"
            autoComplete="off"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)} // Update the newCategory state
          />
          <Button
            variant="secondary"
            id="addCategoryBTN"
            title="Add category"
            className="rounded   "
            onClick={handleAddCategory} // Call the function to add a category
          >
            Add
          </Button>
        </InputGroup>
      </Form.Group>

      
    </div>
  );
};

export default memo(UploadNewPostCategory);
