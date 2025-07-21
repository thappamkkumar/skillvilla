import { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddCompanyProfileForm from '../../../Components/Customer/AddCompanyProfile/AddCompanyProfileForm';
import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';
import { updateJobState } from '../../../StoreWrapper/Slice/JobSlice';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

const RegisterCompanyPage = () => {
	
    const authToken = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [submissionMsg, setSubmissionMsg] = useState(null);
    const [showModel, setShowModel] = useState(false);
    const [shouldNavigate, setShouldNavigate] = useState(false); // New state
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: null,
        website: '',
        industry: '',
        address: '',
        email: '',
        phone: '',
        established_year: ''
    });
    const [errors, setErrors] = useState({});

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Name is required.';
        if (!formData.description) newErrors.description = 'Description is required.';

        const urlPattern = /^(https?:\/\/)?([\w\d\-_]+(\.[\w\d\-_]+)+)([\w\d\-\._~:/?#[\]@!$&'()*+,;=]*)$/;
        if (!formData.website) {
            newErrors.website = 'Website is required.';
        } else if (!urlPattern.test(formData.website)) {
            newErrors.website = 'Please enter a valid website URL (e.g., https://company.com).';
        }

        if (!formData.industry) newErrors.industry = 'Industry is required.';
        if (!formData.address) newErrors.address = 'Address is required.';
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.phone) {
					newErrors.phone = 'Phone number is required.';
				} else if (!/^\d{10}$/.test(formData.phone)) { // Assuming phone is 10 digits
					newErrors.phone = 'Phone number must be 10 digits.';
				}
        if (!formData.established_year) newErrors.established_year = 'Established year is required.';
        if (!formData.logo) {
            newErrors.logo = 'Logo is required.';
        } else {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxFileSize = 2 * 1024 * 1024; // 2MB
            if (!allowedTypes.includes(formData.logo.type)) {
                newErrors.logo = 'Invalid file type. Only JPG, JPEG and PNG are allowed.';
            } else if (formData.logo.size > maxFileSize) {
                newErrors.logo = 'File size exceeds 2MB.';
            }
        }

        return newErrors;
    };

    // Handle form submission
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
								setSubmissionMsg( 'Form must be filled and valid');
								setShowModel(true);
            } else {
                try {
                    setSubmitting(true);
                    setErrors({});
                    const formDataToSend = new FormData();
                    Object.entries(formData).forEach(([key, value]) => {
                        formDataToSend.append(key, value);
                    });

                    const resultData = await serverConnection('/register-new-company', formDataToSend, authToken, 'multipart/form-data');

                    if (resultData.status === true) {
                        setSubmissionMsg('Company profile created successfully!');
                        setShowModel(true);
                        setSubmitting(false);
 
                        setShouldNavigate(true); // Set navigation flag
                    } else {
											if(resultData.alreadyHasCompany != null && resultData.alreadyHasCompany == true)
											{
                        setSubmissionMsg('User already has registered company details.');
											}
											else
											{
                        setSubmissionMsg('Failed to register the company profile. Please try again.');
											}
                        setShowModel(true);
                        setSubmitting(false);
                    }
                } catch (error) {
                    setSubmissionMsg('An error occurred. Please try again.');
                    setShowModel(true);
                    setSubmitting(false);
                }
            }
        },
        [authToken, formData, dispatch]
    );

    // Close modal and navigate
    const handleModalClose = (val) => {
        setShowModel(false);
        if (shouldNavigate) {
            navigate('/create/job');
        }
    };

    return (
			<>
				<PageSeo 
					title="Add New Company | SkillVilla"
					description="Create a new company profile and start posting jobs on SkillVilla."
					keywords="add company, new company profile, SkillVilla, create company"
				/>

        <div  >
            <MessageAlert
                setShowModel={handleModalClose}
                showModel={showModel}
                message={submissionMsg} 
            />
            {!submitting ? (
                <div className="  px-2 py-4 p-sm-3 p-md-4 p-lg-5  rounded    sub_main_container    "  >
									<h3 className="pb-2 fw-bold">Create Your Company Profile</h3>
										
                    <AddCompanyProfileForm
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        setErrors={setErrors}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                    />
                </div>
            ) : (
                <div className="no_posts_message">
                    <p>Your submission is being processed. Please wait a moment.</p>
                </div>
            )}
        </div>
			</>
    );
};

export default memo(RegisterCompanyPage);
