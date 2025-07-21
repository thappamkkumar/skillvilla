import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmail } from '../../../StoreWrapper/Slice/AuthSlice';
import serverConnection from '../../../CustomHook/serverConnection';
import { Form, InputGroup, Button, Row, Col } from 'react-bootstrap';

const UpdateEmail = ({ setsubmitionMSG, setShowModel, email }) => {
  const [newEmail, setNewEmail] = useState(email);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const authToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const timeLimit = 300; // 5 minutes

  // Handle email input
  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  // Send or Resend OTP
  const handleSendOTP = useCallback(async () => {
    if (!newEmail || newEmail === email) return;

    setIsSending(true);
    try {
      const response = await serverConnection('/update-email-send-OTP', { email: newEmail }, authToken);

      if (response && response.status) {
        setOtpSent(true);
        setCountdown(timeLimit);
        setsubmitionMSG('OTP sent successfully.');
      } else {
        setOtpSent(false);
        setsubmitionMSG(response?.message || 'Failed to send OTP');
      }
    } catch (error) {
      setsubmitionMSG('Error while sending OTP.');
    } finally {
      setIsSending(false);
      setShowModel(true);
    }
  }, [newEmail, email, authToken, setsubmitionMSG, setShowModel]);

  // Verify OTP
  const handleVerifyOTP = useCallback(async () => {
    if (!otp) return;

    setIsVerifying(true);
    try {
      const response = await serverConnection('/update-email', { email: newEmail, otp }, authToken);

      if (response && response.status) {
        dispatch(updateEmail({ email: newEmail }));
        setsubmitionMSG('Email updated successfully!');
        setOtpSent(false);
        setOtp('');
      } else {
        setsubmitionMSG(response?.message || 'Failed to verify OTP.');
      }
    } catch (error) {
      setsubmitionMSG('Error while verifying OTP.');
    } finally {
      setIsVerifying(false);
      setShowModel(true);
    }
  }, [otp, newEmail, authToken, dispatch, setsubmitionMSG, setShowModel]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && otpSent) {
      setOtpSent(false); // Hide OTP section
    }
  }, [countdown, otpSent]);

  return (
    <Row className="p-0 m-0">
      {/* Email Input */}
      <Col xs={12} sm={6} className="p-3">
        <Form.Group controlId="formEmail">
          <Form.Label><strong className="text-muted">Email</strong></Form.Label>
          <InputGroup>
            <Form.Control
              type="email"
              value={newEmail}
              className="shadow-none bg-light formInput"
              onChange={handleEmailChange}
              autoComplete="off"
            />
            {countdown === 0 && (
              <Button
                variant="dark"
                onClick={handleSendOTP}
                disabled={isSending || newEmail === email}
              >
                {isSending ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
              </Button>
            )}
          </InputGroup>
        </Form.Group>
      </Col>

      {/* OTP Input */}
      {otpSent && (
        <Col xs={12} sm={6} className="p-3">
          <Form.Group controlId="formOTP">
            <Form.Label>
              <strong className="text-muted">Enter OTP</strong>
							{countdown > 0 && (
								<span className="text-danger ms-2">
									Expires in  {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
								</span>
							)}
               
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                className="shadow-none bg-light formInput"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                autoComplete="off"
              />
              <Button
                variant="dark"
                onClick={handleVerifyOTP}
                disabled={isVerifying || otp.length === 0}
              >
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
      )}
    </Row>
  );
};

export default UpdateEmail;
