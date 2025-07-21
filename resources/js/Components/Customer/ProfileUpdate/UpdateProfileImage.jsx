import   {  memo,useState, useCallback }  from 'react'; 
import { useSelector, useDispatch } from "react-redux"; 
import Spinner from 'react-bootstrap/Spinner'; 
import { BsCamera } from "react-icons/bs";    
import MessageAlert from '../../MessageAlert';
 
 import { updateProfileImage  } from '../../../StoreWrapper/Slice/AuthSlice';

import serverConnection from '../../../CustomHook/serverConnection';

const UpdateProfileImage = ({ id, setUserProfileData}) => {
		const authToken = useSelector((state) => state.auth.token); //selecting token from store
		const [uploading, setUploading] = useState(false);
		const [submitionMSG, setSubmitionMSG] = useState(null); //state for store info about form submition  
		const [showModel, setShowModel] = useState(false); //state for alert message  
	 
		const dispatch = useDispatch();
	
	
		//handle file change
		const handleFileChange = useCallback(async (event) => {
				const MAX_FILE_SIZE = 5120 * 1024; // 5MB 
        const file = event.target.files[0];
				 
        if (!file || !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
             
						setSubmitionMSG( 'Please upload a valid image (jpg, jpeg, png)');
						setShowModel(true);
						event.target.value = ''; 
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setSubmitionMSG('File size must be less than 5MB');
            setShowModel(true);
						event.target.value = ''; 
            return;
        }
        await uploadImage(file);
    }, []);
	    
			
		//handle file upload
	  const uploadImage = useCallback(async (file) => {
				if(!authToken  )
				{
					return;
				}
			
        setUploading(true);
        const formData = new FormData();
        formData.append('profile_image', file); 
				
				try { 
					
					let contentType = 'multipart/form-data'; 
					const data = await serverConnection('/update-user-profile-image', formData, authToken, contentType ); 
			
			  
					// console.log(data);
					if(data.status == true)
					{  
						const newImageUrl = `${data.data}?timestamp=${Date.now()}`;
						
						setSubmitionMSG("Profile image is update successfully");  
						 
						
						setUserProfileData(pre=>{
								let updatedData = {...pre};
								if(updatedData.customer != null)
								{
									updatedData.customer.image = newImageUrl;
								} 
								 
								return updatedData;
							});
						
						dispatch(updateProfileImage({image:  newImageUrl }));
			 
			  
				  }
					else
					{
						setSubmitionMSG('Failed to update profile image. Please try again.');
						
					}
             
        } catch (err) {
             console.log(err);
						setSubmitionMSG( 'An error occurred. Please try again.');
        } finally {
            setUploading(false);
						setShowModel(true);
						event.target.value = '';
        }
				
    }, [id, authToken, setUserProfileData]);
	    
    return (
       <div className="  profile_image_update_btn_container  d-flex justify-content-end px-3   ">
					<label 
					htmlFor="imageUpload" 
					className=" p-2 rounded-circle profile_image_update_btn "
					role="button"
          title="Click to update profile image"
					>
						{
							uploading ?
							<Spinner   />
							:
							<BsCamera className=" fs-3" />
						} 
						 
									 
						<input 
						type="file" 
						id="imageUpload"
						accept=".jpg,.jpeg,.png"
						className="d-none"
						onChange={handleFileChange}
						disabled={uploading}
						/>
					</label>
           <MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>  
        </div>
    );
};

export default memo(UpdateProfileImage);
