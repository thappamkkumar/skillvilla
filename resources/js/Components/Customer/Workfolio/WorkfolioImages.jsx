import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ImageViewBox from '../../Common/ImageViewBox';
import handleImageError from '../../../CustomHook/handleImageError';

const IMAGES_PER_PAGE = 10;

const WorkfolioImages = ({ images = [] }) => {
  const [loadedImages, setLoadedImages] = useState({});
  const [viewImage, setViewImage] = useState({ viewImage: false, image: null });
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const topRef = useRef(null); // Reference for scrolling to top

  const paginatedImages = useMemo(() => {
    const start = currentPage * IMAGES_PER_PAGE;
    return images.slice(start, start + IMAGES_PER_PAGE);
  }, [images, currentPage]);

  const handleImageLoad = useCallback((imageUrl) => {
    setLoadedImages((prev) => ({ ...prev, [imageUrl]: true }));
  }, []);

  const handleImageView = useCallback((image) => {
    setViewImage({ viewImage: true, image });
  }, []);

  const handleHideImageView = useCallback(() => {
    setViewImage((prev) => ({ ...prev, viewImage: false }));
  }, []);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Scroll to top when currentPage changes
  useEffect(() => {
		if(currentPage == 0)return;
    scrollToTop();
  }, [currentPage]);

  return (
    <div>
      <ImageViewBox viewImage={viewImage} handleHideImageView={handleHideImageView} />

      <h4 ref={topRef}>Images</h4>

      <Row className="p-0 pt-2 w-100 m-0 justify-content-center">
        {paginatedImages.map((imageName, index) => (
          <Col
            xs={12} sm={12} md={6} lg={4}  
            className="RelativeContainer m-0 p-3"
            key={index}
            onClick={() => handleImageView(imageName)}
          >
            {!loadedImages[imageName] && (
              <div className="placeholder" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  width: '100%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                }}>
                  <Spinner />
                </div>
              </div>
            )}
            <img
              src={imageName || '/images/imageError.jpg'}
              alt={`Image ${index + 1 + currentPage * IMAGES_PER_PAGE}`}
              className="rounded   workfolio_images"
              onError={(event) => handleImageError(event, '/images/imageError.jpg')}
              onLoad={() => handleImageLoad(imageName)}
            />
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center align-items-center mt-5">
        <Button variant="secondary" onClick={handlePrev} disabled={currentPage === 0}>
          Previous
        </Button>
        <span className="mx-3">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button variant="secondary" onClick={handleNext} disabled={currentPage >= totalPages - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default WorkfolioImages;
