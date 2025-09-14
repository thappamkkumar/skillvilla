 

import   {memo,useCallback, useState } from 'react';   

import {useSelector , useDispatch } from 'react-redux';  

import Button from 'react-bootstrap/Button';   
import Spinner from 'react-bootstrap/Spinner';   

import { BsBroadcast } from "react-icons/bs";

import ProfessionalLiveStreamForm from './ProfessionalLiveStreamForm';

import serverConnection from '../../../CustomHook/serverConnection';


const ProfessionalLiveStream = ({
	setShowModel,
	setsubmitionMSG,
}) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store 
	const [categories, setCategories] = useState([
		{id:2, name:'adas'},
		{id:4, name:'adfdsfdsf dsf dsdas'},
	]);
	const [submitting, setSubmitting] = useState(null);
	const [formData, setFormData] = useState({
		title:'',
		description:'',
		category_id:null,
		
	});
	const [errors, setErrors] = useState({});
 
	const dispatch = useDispatch(); 
	
	
	
	// Validate form
	const validateForm = () => {
			const newErrors = {};
 
			// Validate text inputs
			if (!formData.title) newErrors.title = 'Title is required.';
			if (!formData.description) newErrors.description = 'Description is required.';
			if (!formData.category_id) newErrors.category_id = 'Category is required.';
		
		
			return newErrors;
	};
	
	//function go for quick live  
	const goLive = useCallback(async(e)=>{
		e.preventDefault();
		
		
		
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			//console.log(validationErrors);
				setErrors(validationErrors);
				setsubmitionMSG( 'Form must be filled and valid');
				setShowModel(true);
				return;
		}
		
		
		try
		{
			setSubmitting(true);
			setErrors({});
			
			console.log(formData);
			
			setFormData({
				title:'',
				description:'',
				category_id:null
			});
			setsubmitionMSG('live');
			
			
		}
		catch(e)
		{
			setsubmitionMSG('error:- ' + e);
		}
		finally
		{
			setShowModel(true);
			setSubmitting(false);
		}
		
	}, [authToken, dispatch, formData]);

 
	return ( 
		   
			 	 
				<div className="w-100 h-auto  ">
					<h3 className="pb-2 fw-bold">Professional Live</h3>
					
					<ProfessionalLiveStreamForm 
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						goLive={goLive}
						submitting={submitting}
						categories={categories}
					/>
					 
				</div>
			 
				 
	);
	
};

export default memo(ProfessionalLiveStream);
