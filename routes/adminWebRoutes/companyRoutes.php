<?php

use App\Http\Controllers\Admin\AdminCompanyController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminCompanyController::class)->group(
				function (){
					
					//Route for upload new message in company
					 Route::post('get-company-list', 'getComanyList')->name('admin.getComanyList');
					 //route for delete company
					Route::post('delete-company', 'deleteCompany')->name('admin.deleteCompany');
				}                                        
			);  
		