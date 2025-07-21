import { memo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import TextEditor from '../../Common/TextEditor';
import MessageAlert from '../../MessageAlert';

import serverConnection from '../../../CustomHook/serverConnection';

// Utility to remove HTML tags and return plain text
const stripHtml = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

const UpdateCompanyProfileAbout = ({ description }) => {
  const authToken = useSelector((state) => state.auth.token);

  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitionMSG, setsubmitionMSG] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [formData, setFormData] = useState({
    description: description || '',
  });

  const handleAboutChange = (val) => {
    setFormData((prevData) => ({ ...prevData, description: val }));
  };

  const handleUpdateAbout = useCallback(
    async (e) => {
      e.preventDefault();

      const plainText = stripHtml(formData.description).trim();

      if (!plainText) {
        setErrorMessage('Description is required.');
        return;
      }

      setErrorMessage('');
      setSubmitting(true);

      try {
        const data = await serverConnection(
          '/update-company-description',
          formData,
          authToken
        );

        if (data.status === true) {
          setsubmitionMSG('Company description is updated successfully.');
        } else {
          setsubmitionMSG(data.message || 'Failed to update description.');
        }

        setShowModel(true);
      } catch (error) {
        console.error(error);
        setsubmitionMSG('An error occurred while updating the company description.');
        setShowModel(true);
      } finally {
        setSubmitting(false);
      }
    },
    [authToken, formData]
  );

  return (
    <div className="w-100 h-auto">
      <MessageAlert
        setShowModel={setShowModel}
        showModel={showModel}
        message={submitionMSG}
      />
      <h4 className="text-muted">About</h4>
      <Form noValidate onSubmit={handleUpdateAbout} autoComplete="off">
        <div className="px-2 pt-2">
          <Form.Group className="mb-3" controlId="companyDescription">
            <TextEditor
              value={formData.description}
              onChange={handleAboutChange}
              className={`custom-text-box ${errorMessage && 'border-danger'}`}
              placeholder="Provide a brief overview of your company and its culture..."
            />
            <small className="text-danger mt-1">{errorMessage}</small>
          </Form.Group>
        </div>
        <div className="px-2">
          <Button
            type="submit"
            className="mt-2 px-4"
            variant="dark"
            id="submitFormButton"
            title="Upload company profile"
            disabled={submitting}
          >
            {submitting && <Spinner animation="border" variant="light" size="sm" />}
            <span className={`${submitting ? 'ps-3' : ''}`}>Update</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default memo(UpdateCompanyProfileAbout);
