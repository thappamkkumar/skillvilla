import {useState, useCallback} from "react"; 
import Spinner from 'react-bootstrap/Spinner';
import ImageViewBox from '../../Common/ImageViewBox';
import handleImageError from '../../../CustomHook/handleImageError';

const WorkfolioImages = ({ images,  }) => {
	const [loadedImages, setLoadedImages] = useState({}); // To track which images are loaded
  const [viewImage, setViewImage] = useState({viewImage:false, image:null,});
 // Handle image load success
  const handleImageLoad = useCallback((imageUrl) => {
    setLoadedImages((prev) => ({ ...prev, [imageUrl]: true }));
  },[]);

	//Handle  image view
	const handleImageView = useCallback((image) =>
	{
		setViewImage({viewImage:true, image:image,});
	},[]);
	//Handle hide image view
	const handleHideImageView = useCallback(( ) =>
	{
		//setViewImage({viewImage:false, image:null,});
		setViewImage(prev => ({...prev, viewImage:false }));
	},[]);
	
	
  return (
		<div >
			<ImageViewBox viewImage={viewImage} handleHideImageView={handleHideImageView} />
			
			<h4>Images</h4>
			<div className="pt-2 masonry">
				{images.map((imageName, index) => (
					<div className="masonry-item" key={index}  style={{ position: 'relative' }} 
					onClick={()=>{handleImageView(imageName);}}>
						{!loadedImages[imageName]   && (
                <div
                  className="placeholder"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f0f0f0', 
                      
                  }}
                >
                 <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
										width: '100%', 
                    height: 'auto',										
										transform:'translateY(-50%)',
										textAlign:'center', 										
                  }} > 
										<Spinner />
									</div>
                </div>
              )}
						<img
							src={imageName ||  '/images/imageError.jpg'}
							alt={`Image ${index + 1}`}
							className="masonry-image"
							onError={()=>{handleImageError(event, '/images/imageError.jpg')} }
							onLoad={() => handleImageLoad(imageName)}
							style={{cursor:'pointer'}}
						/>
						 
					</div>
				))}
			</div>
			
			 
		
    </div>
  );
};

export default WorkfolioImages;
