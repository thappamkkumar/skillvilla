 

import   {memo, useState } from 'react';   
 
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form';  
import InputGroup from 'react-bootstrap/InputGroup';
 import Row from 'react-bootstrap/Row';  
import Col from 'react-bootstrap/Col';  
  
import { BsX, BsEye } from 'react-icons/bs';

import TextEditor from '../../Common/TextEditor';  
  
const AddWorkForm = ({ formData, setFormData, errors, onSubmit, setPreviewImages, setWatchVideo,setPreviewOtherFile}) => {
  const [newCategory, setNewCategory] = useState(''); // State for new category input

	 // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            // Handle multiple images for the `images` field
            if (name === 'images') {
                setFormData((prevData) => ({
                    ...prevData,
                    images: [...files],
                }));
								 
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
            }
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };
		
	// handle add description to form data
	const handleDescriptionChange = (val) => { 
        setFormData((prevData) => ({ ...prevData, description: val }));
    };
		
		
		// Handle adding a category
  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory && !formData.category.includes(trimmedCategory)) {
      setFormData((prevData) => ({
        ...prevData,
        category: [...prevData.category, trimmedCategory],
      }));
      setNewCategory('');
    }
  };

  // Handle removing a category
  const handleRemoveCategory = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      category: prevData.category.filter((_, i) => i !== index),
    }));
  };
	
	
	  //handle  preview mages
		const handlePreviewImages = () =>
		{
			 setPreviewImages(true);
		} 
		
		//handle  watch video
		const handleWatchVideo = () =>
		{
			 setWatchVideo(true);
		} 
		
		//handle  preview other files
		const handlePreviewOtherFile = () =>
		{
			 setPreviewOtherFile(true);
		}
		
		
	return ( 
		<div  >
		   
			<Form noValidate onSubmit={onSubmit} autoComplete="off">
				<Row className="w-100  p-0 m-0">
          <Col xs={12} md={12} className="mb-3">
						<Form.Group className="mb-3" controlId="workfolioTitle">
                <Form.Label>Title <small className="text-danger">*</small></Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter title"
										className="formInput"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>
          </Col>
					 
         </Row>
				 
				 
				 {/* Categories Section */}
        <Row className="w-100 m-0 mb-3">
          <Col xs={12} className="m-0">
            <Form.Label>Categories <small className="text-danger">*</small></Form.Label>
            {formData.category.length > 0 && (
              <div className="d-flex flex-wrap pb-2">
                {formData.category.map((cat, index) => (
                  <span key={index} className="border border-0 mx-1 my-1 p-1 px-2 rounded tech_skill">
                    <span className="pe-3">{cat}</span>
                    <Button
                      variant="danger"
                      title={`Remove category ${index}`}
                      id={`removeCategory${index}`}
                      className="p-0 mb-1   tech_skill_remove_btn"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <BsX className="fs-5" style={{ strokeWidth: '1.5' }} />
                    </Button>
                  </span>
                ))}
              </div>
            )}
          </Col>
          <Col xs={8} className=" ">
            <Form.Group className=" " controlId="workfolioCategory">
              <Form.Control
                type="text"
                className="formInput"
                placeholder="Add a category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
								isInvalid={!!errors.title}
              />
            </Form.Group>
          </Col>
          <Col xs={4} className=" ">
            <Button variant="secondary" title="Add category" id="addCategory" className="w-100   " onClick={handleAddCategory}>
              Add  
            </Button>
          </Col>
					
					<small className="text-danger mt-1">{errors.category}</small>
        </Row>
				 
				 
				 
         <Row className="w-100   m-0">
          <Col xs={12} md={12} className="mb-3">
						<Form.Group className="mb-3" controlId="workfolioDescription">
                <Form.Label>Description <small className="text-danger">*</small></Form.Label>
								<TextEditor
									value={formData.description}
									onChange={handleDescriptionChange}
									className={`custom-text-box ${errors.description && 'border-danger'}`}
									placeholder="Write your work description..."
								/>
                 
                <small className="text-danger mt-1">{errors.description}</small>
            </Form.Group>
          </Col>
					 
         </Row>
         <Row className="w-100   m-0">
          <Col xs={12} md={6} className="mb-3">
						 <Form.Group className="mb-3" controlId="workfolioImage">
                <Form.Label>Images [<small className="text-danger">optional</small>]</Form.Label>
                <Form.Control
                    type="file"
										className="formInput"
                    name="images"
                    accept="image/jpeg, image/png, image/jpeg"
                    onChange={handleChange}
                    isInvalid={!!errors.images}
										multiple
                />
                <Form.Control.Feedback type="invalid">{errors.images}</Form.Control.Feedback>
								{
									(formData.images != null && formData.images.length > 0)
									&&
									<Button variant="light" onClick={handlePreviewImages} className=" mt-3 py-1 text-primary " title="Preview Images" id="previewImagesBTN">
										<BsEye className=" fs-4 p-1"/>  images
									</Button>
								}
            </Form.Group>
          </Col>
					<Col xs={12} md={6} className="mb-3">
						 <Form.Group className="mb-3  " controlId="workfolioVideo">
                <Form.Label>Videos [<small className="text-danger">optional</small>]</Form.Label>
                <Form.Control
                    type="file"
										className="formInput"
                    name="video"
                    accept="video/mp4"
                    onChange={handleChange}
                    isInvalid={!!errors.video}
                />
                <Form.Control.Feedback type="invalid">{errors.video}</Form.Control.Feedback>
								{
									(formData.video != null )
									&&
									<Button variant="light" onClick={handleWatchVideo} className=" mt-3 py-1 text-primary " title="Watch Video" id="watchVideoBTN">
										<BsEye className=" fs-4 p-1"/> Video
									</Button>
								}
            </Form.Group>

          </Col>
          
          <Col xs={12} md={6} className="mb-3">
						<Form.Group className="mb-3" controlId="workfolioOther">
                <Form.Label>Other Files [<small className="text-danger">optional</small>]</Form.Label>
                <Form.Control
                    type="file"
										className="formInput"
                    name="other"
                    accept="application/zip, application/pdf"
                    onChange={handleChange}
                    isInvalid={!!errors.other}
                />
                <Form.Control.Feedback type="invalid">{errors.other}</Form.Control.Feedback>
								 
            </Form.Group>
          </Col>
					<Col xs={12} md={12} className="mb-3">
						 <Button variant="dark" type="submit"  onClick={onSubmit} className="w-100 mt-3  " title="submit work to workfolio" id="addWorkFormSubmitButton">
                Submit
            </Button>
          </Col>
         </Row>
            

            

            

           
						
           
            

           
        </Form>
				
				<div className="pt-5">
					<h4>Notes</h4>
					<ul>
						<li><span className="text-danger">*</span> indicates important fields.</li>
						<li>[<span className="text-danger">optional</span>] indicates optional fields.</li>
						<li><strong>Images:</strong> Only JPG and PNG formats are allowed. A maximum of 10 images can be uploaded.</li>
						<li><strong>Video:</strong> Only MP4 format is allowed, and the file size must be less than 500 MB.</li>
						<li><strong>Other files:</strong> ZIP and PDF formats are allowed, with a maximum file size of 100 MB.</li>
					</ul>
				</div>

			</div>
	);
	
};

export default memo(AddWorkForm);
