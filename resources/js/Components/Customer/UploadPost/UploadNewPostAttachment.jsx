import React, { memo, useCallback, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import ReactPlayer from 'react-player';
import { BsChevronCompactLeft, BsChevronCompactRight, BsX } from 'react-icons/bs';

const UploadNewPostAttachment = ({ setFiles }) => {
    const [attachment, setAttachment] = useState([]);
    const [showAttachment, setShowAttachment] = useState(false);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false); // Updated initial value
    const [wrongFile, setWrongFile] = useState({ status: false, message: '' });

    const handleCloseAttachment = () => setShowAttachment(false);
    const handleShowAttachment = () => {
        setIndex(0);
        setShowAttachment(true);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setWrongFile({ status: false, message: '' });
        let filePreviews = [];

        if (files.length === 0) {
            setAttachment([]);
            setFiles(null);
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        const maxVideoDuration = 60; // 60 seconds

        filePreviews = files.map((file) => {
            if (!allowedTypes.includes(file.type)) {
                e.target.value = null;
                setWrongFile({ status: true, message: 'Only JPEG, PNG, JPG and MP4 files are allowed.' });
                return null;
            }

            if (file.size > maxFileSize) {
                e.target.value = null;
                setWrongFile({ status: true, message: 'File size exceeds 10MB' });
                return null;
            }

            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.src = URL.createObjectURL(file);
                return new Promise((resolve) => {
                    video.onloadedmetadata = () => {
                        URL.revokeObjectURL(video.src);
                        if (video.duration > maxVideoDuration) {
                            e.target.value = null;
                            setWrongFile({ status: true, message: 'Video duration exceeds 60 seconds' });
                            resolve(null);
                        } else {
                            resolve({
                                file,
                                preview: URL.createObjectURL(file)
                            });
                        }
                    };
                });
            }

            return {
                file,
                preview: URL.createObjectURL(file)
            };
        });

        Promise.all(filePreviews).then((results) => {
            const validPreviews = results.filter(Boolean);
            setAttachment(validPreviews);
            setFiles(files);
        });
    };

    const changeSlide = (direction) => {
        setIndex((prevIndex) => {
            if (direction === 'prev') {
                return Math.max(prevIndex - 1, 0);
            } else {
                return Math.min(prevIndex + 1, attachment.length - 1);
            }
        });
    };

    const setLoad = useCallback(() => {
        setLoading(false);
    }, []);

    return (
        <div className="">
            <Offcanvas
                placement="bottom"
                show={showAttachment}
                onHide={handleCloseAttachment}
                className="bg-white rounded comment_box_main_Container mx-auto h-100"
            >
                <Offcanvas.Header className="bg-white d-flex flex-wrap justify-content-between">
                    <Offcanvas.Title>Selected Files</Offcanvas.Title>
                    <Button
                        variant="outline-dark"
                        className="p-1 border border-2 border-dark"
                        onClick={handleCloseAttachment}
                        id="closeShowAttachmentBTn"
                        title="Close Preview"
                    >
                        <BsX className="   fw-bold fs-3" />
                    </Button>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0 m-0">
                    {attachment.length > 0 && (
                        <div className="postDetailAttachmentContainer bg-light">
                            <div className="masonry-item">
                                {attachment[index].file.type.startsWith('image/') ? (
                                    <Image
                                        src={attachment[index].preview}
                                        alt={`Selected file ${index}`}
                                        className="postDetailAttachment"
                                        onLoad={setLoad}
                                    />
                                ) : (
                                    <ReactPlayer
                                        url={attachment[index].preview}
                                        loop={false}
                                        width="100%"
                                        height="100%"
                                        playing={false}
                                        controls={true}
                                        className="postDetailAttachment"
                                        onReady={setLoad}
                                    />
                                )}
                            </div>

                            {index > 0 && (
                                <Button
                                    variant="*"
                                    onClick={() => changeSlide('prev')}
                                    className="fs-3 py-3 px-1 mx-2 postDetailVideoControllerBtn"
                                    id="postDetailVideoController-PrevBtn"
                                    title="Previous"
                                >
                                    <BsChevronCompactLeft style={{ strokeWidth: '1' }} />
                                </Button>
                            )}
                            {index < attachment.length - 1 && (
                                <Button
                                    variant="*"
                                    onClick={() => changeSlide('next')}
                                    className="fs-3 py-3 px-1 mx-2 postDetailVideoControllerBtn"
                                    id="postDetailVideoController-NextBtn"
                                    title="Next"
                                >
                                    <BsChevronCompactRight style={{ strokeWidth: '1' }} />
                                </Button>
                            )}
                            {loading && (
                                <div
                                    className="w-100 h-100 bg-light d-flex justify-content-center align-items-center postDetailAttachment"
                                    style={{ position: 'absolute', top: '0px' }}
                                >
                                    <Spinner className="mx-auto" animation="border" size="md" />
                                </div>
                            )}
                        </div>
                    )}
                </Offcanvas.Body>
            </Offcanvas>

            <Form.Group controlId="PostAttachment">
                <Form.Label className="py-1 h6">Attachments</Form.Label>
                <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="shadow-none bg-light formInput"
                    name="attachment"
                    accept=".jpg, .jpeg, .png, .mp4"
                    autoComplete="off"
                />
                <Form.Text className={`${wrongFile.status && 'text-danger'}`}>
                    {wrongFile.status && wrongFile.message}
                </Form.Text>
            </Form.Group>
            <div className="py-2">
                {attachment.length > 0 && (
                    <Button
                        variant="secondary" 
                        onClick={handleShowAttachment}
                        id="showAttachmentBTN"
                        title="View attachments"
                    >
                        Preview
                    </Button>
                )}
            </div>
        </div>
    );
};

export default memo(UploadNewPostAttachment);
