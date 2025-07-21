<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Company;
use JWTAuth;
use Exception;
class AdminCompanyController extends Controller
{
    //function for fetching list of comapanies
		function getComanyList()
		{
			try
			{ 
			
				$companyList = Company::
				select('id', 'user_id', 'logo', 'name', 'industry', 'established_year')
				->with([
					'user:id,userID'
				])
				->withCount('jobs')
				->orderBy('id', 'asc')->cursorPaginate(10);
				
				// Convert logo paths to full URLs
         foreach ($companyList as $company) {
				 
					$company->logo = $company->logo
                ? url(Storage::url('company_logo/' . $company->logo))  
                : null;
        } 
				
				
				return response()->json([
            'status' => true,
            'message' => 'Company list fetched successfully.',
            'companyList' => $companyList,
             
        ]);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		} 
		
		//function for delete company
		function deleteCompany(Request $request)
		{
			try
			{ 
				$company = Company::findOrFail($request->id);
				
				// Delete related jobs and applications along with associated files
        foreach ($company->jobs as $job) {
            foreach ($job->applications as $application) {
                // Delete resume if exists
								if($application->resume) {
									 $resumePath = "job_application_resume/" . $application->resume;
									 if (Storage::disk('public')->exists($resumePath)) {  
										Storage::disk('public')->delete($resumePath);
									} 
								}

								// Delete introduction video if exists
								if($application->self_introduction) {
										$introPath = "job_application_introduction/" . $application->self_introduction;
									 if (Storage::disk('public')->exists($introPath)) {  
										Storage::disk('public')->delete($introPath);
									} 
								}
 
            }
						
           
        }
				
				 // Delete company logo if it exists
        if ($company->logo) {
					$logoPath = "company_logo/" . $company->logo;
					 if (Storage::disk('public')->exists($logoPath)) {  
						Storage::disk('public')->delete($logoPath);
					} 
					 
        }
				
				// Finally, delete the company
        $company->delete();
				
				return response()->json([
						'status' => true,
            'message' => 'Company and all related data deleted successfully.'
        ]);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
}
