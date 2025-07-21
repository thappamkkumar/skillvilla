import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AddProblemForm = ({ formData, setFormData, errors, onSubmit,   }) => {

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (files) {
            // Handle file input (attachment)
            setFormData( { 
										story_file: files[0],  
									});
                  
        }  
				
			  
    };
   
	 

    return (
        <div className="py-4">
            <Form noValidate onSubmit={onSubmit} autoComplete="off">
                <Form.Group className="mb-3" controlId="storiesFile">
										<Form.Label>Select File for Story </Form.Label>
										<Form.Control
												type="file"
												className="formInput"
												name="story_file"  
												accept="image/jpg,image/jpeg, image/png, video/mp4"
												onChange={handleChange}
												isInvalid={!!errors.story_file}
										/>
										<Form.Control.Feedback type="invalid">{errors.story_file}</Form.Control.Feedback>
										
									</Form.Group> 
                
								 
                 

                <Button variant="dark" type="submit"   className="w-100 mt-3  " title="Upload you story" id="addStoriesFormSubmitButton">
                    Upload
                </Button>
            </Form>

            

        </div>
    );
};

export default memo(AddProblemForm);
