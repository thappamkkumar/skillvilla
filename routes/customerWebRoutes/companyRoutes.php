<?php

use App\Http\Controllers\User\CompanyProfile;
use Illuminate\Support\Facades\Route;

	    Route::controller(CompanyProfile::class)->group(
			function (){
				// Route for registering new company
				Route::post('register-new-company', 'registerNewCompany')->name('user.registerNewCompany');
				//Route for get company profle data
				Route::post('get-company-profile', 'getCompanyProfile')->name('user.getCompanyProfile');
				//Route for updating company profile logo 
				Route::post('update-company-logo', 'updateCompanyLogo')->name('user.updateCompanyLogo'); 
				//Route for update company description
				Route::post('update-company-description', 'updateCompanyDescription')->name('user.updateCompanyDescription'); 
				//Route for update company basic -> name,industry,established_year,  
				Route::post('update-company-basic-detail', 'updateCompanyBasicDetail')->name('user.updateCompanyBasicDetail'); 
			//Route for update company contact -> address, phone, website, email
				Route::post('update-company-contact-detail', 'updateCompanyContactDetail')->name('user.updateCompanyContactDetail'); 
			
			
			}                                        
		);     