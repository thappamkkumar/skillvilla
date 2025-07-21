import React, { useState, useRef, useCallback } from "react";
import {useDispatch } from 'react-redux';   
import { Container, Button, Form, Row, Col, Card } from "react-bootstrap";

import serverConnection from '../../../CustomHook/serverConnection'; 
import {updateJobState} from '../../../StoreWrapper/Slice/JobSlice';

import {updateJobState as updateUserJobState} from '../../../StoreWrapper/Slice/UserJobSlice';
 import {updateJobState as updateAppliedSavedJobState} from '../../../StoreWrapper/Slice/AppliedSavedJobSlice';
 
 
const JobApplyForm = ({
  setsubmitionMSG,
  setShowModel,
  job_id,
  authToken,
  setShouldNavigateToNextStep,
}) => {
  const [resume, setResume] = useState(null);
  const [video, setVideo] = useState(null);
  const [resumeError, setResumeError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
  const resumeInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleResumeChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setResumeError("Resume must be a PDF.");
        setResume(null);
        resumeInputRef.current.value = "";
      } else if (file.size > 5 * 1024 * 1024) {
        setResumeError("Resume file must be less than 5MB.");
        setResume(null);
        resumeInputRef.current.value = "";
      } else {
        setResume(file);
        setResumeError(null);
      }
    }
  }, []);

  const handleVideoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "video/mp4") {
        setVideoError("Video must be an MP4 file.");
        setVideo(null);
        videoInputRef.current.value = "";
      } else if (file.size > 20 * 1024 * 1024) {
        setVideoError("Video file must be less than 20MB.");
        setVideo(null);
        videoInputRef.current.value = "";
      } else {
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(file);
        videoElement.onloadedmetadata = () => {
          if (videoElement.duration < 120) {
            setVideoError("Video must be longer than 2 minutes.");
            setVideo(null);
            videoInputRef.current.value = "";
          } else {
            setVideo(file);
            setVideoError(null);
          }
        };
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!resume || !video) {
        if (!resume) setResumeError("Please upload your resume.");
        if (!video) setVideoError("Please upload your introduction video.");
        return;
      }

      if (resumeError || videoError) {
        return;
      }

      try {
        if (!authToken || !job_id) return;

        setSubmitting(true);

        const formData = {
          job_id: job_id,
          resume: resume,
          self_introduction: video,
        };
				
				let contentType = 'multipart/form-data'; 
				
				const resultData = await serverConnection(
					"/upload-job-application",
					formData, 
					authToken, 
					contentType 
				); 
         //console.log(resultData);

        if (resultData && resultData.status) {
          setSubmitting(false);
					
					dispatch(updateJobState({type : 'updateJobAlreadyApplied', job_id: job_id  }));
					dispatch(updateUserJobState({type : 'updateJobAlreadyApplied', job_id: job_id  }));
					dispatch(updateAppliedSavedJobState({type : 'updateJobAlreadyApplied', job_id: job_id  }));
					
          setShouldNavigateToNextStep(3);
          setsubmitionMSG("Job application submitted successfully.");
          setShowModel(true);
        } else {
          setSubmitting(false);
          setShouldNavigateToNextStep(0);
          setsubmitionMSG(resultData.message);
          setShowModel(true);
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setShouldNavigateToNextStep(0);
        setsubmitionMSG("An error occurred. Please try again.");
        setShowModel(true);
      }
    },
    [resume, video, resumeError, videoError, authToken, job_id, setShowModel, setShouldNavigateToNextStep, setsubmitionMSG]
  );

  if (submitting) {
    return (
      <div className="no_posts_message">
        <p>Your submission is being processed. Please wait a moment.</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
		
		
		
		
      <Row className="justify-content-center">
        <Col xs={12} sm={10} lg={8}>
          <Card className="sub_main_container p-3 mb-5  rounded">
            <Card.Body>
              <h3 className="text-center mb-4 fw-bold">Job Application</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formResume">
                  <Form.Label className="font-weight-bold">
                    Resume (PDF)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    className="formInput"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    isInvalid={resumeError}
                    ref={resumeInputRef}
                  />
                  {resumeError && (
                    <Form.Control.Feedback type="invalid">
                      {resumeError}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group controlId="formVideo" className="mt-3">
                  <Form.Label className="font-weight-bold">
                    Introduction Video (MP4, &gt; 2 minutes)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".mp4"
                    className="formInput"
                    onChange={handleVideoChange}
                    isInvalid={videoError}
                    ref={videoInputRef}
                  />
                  {videoError && (
                    <Form.Control.Feedback type="invalid">
                      {videoError}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Button
                  variant="dark"
                  type="submit"
                  disabled={submitting}
                  className="  w-100 mt-4"
                  title="Submit job application"
                  id="submitJobApplication"
                >
                  Apply
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default JobApplyForm;
