<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Company; 


use JWTAuth;
use Exception;
class CompanyProfile extends Controller
{
    //
		
	//function for register new Company
	function registerNewCompany(Request $request)
	{
		$request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg|max:5120', // 5MB max
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'website' => 'required|url',
            'industry' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'established_year' => 'required|integer|min:1900|max:' . date('Y'),
        ]);
				
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				if($user->company) 
				{
						$data = ['status' => false,'message'=> 'User already has registered company details.', 'alreadyHasCompany'=>true ]; 
						return response()->json($data);
				} 
				// Create a new CompanyProfile instance
        $newProfile = new Company();
        $newProfile->user_id = $user->id; // Assuming the user is authenticated
        $newProfile->name = $request->input('name');
        $newProfile->description = $request->input('description');
        $newProfile->website = $request->input('website');
        $newProfile->industry = $request->input('industry');
        $newProfile->address = $request->input('address');
        $newProfile->email = $request->input('email');
        $newProfile->phone = $request->input('phone');
        $newProfile->established_year = $request->input('established_year');
        $newProfile->save();
				
				 // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoFileName = 'company_' . $newProfile->id . '_logo.' . $request->file('logo')->extension();
           // $request->file('logo')->move(public_path('company_logo/'), $logoFileName);
						$request->file('logo')->storeAs('company_logo', $logoFileName, 'public');

            $newProfile->logo = $logoFileName;
            $newProfile->save();
        }
				
				// Return  as a JSON response
				$data = ['status' => true,'message'=> 'Company is register succssfeully.',  ]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				 $data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				// $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}
	
	//function for fetch  Company profile
	function getCompanyProfile(Request $request)
	{
		 
				
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				 
				// Create a new CompanyProfile instance
        $companyProfile =  Company::
				with(['user:id,userID,name',
				'user.customer:id,user_id,image'
				])
				->findOrFail($request->company_id);
        
				//getting full url of logo
				if($companyProfile->user->customer->image)
				{
					$companyProfile->user->customer->image = $companyProfile->user->customer->image
					? url(Storage::url('profile_image/' . $companyProfile->user->customer->image))  
					: null;	 
				}
				
				//getting full url of logo
				$companyProfile->logo = $companyProfile->logo
				? url(Storage::url('company_logo/' . $companyProfile->logo))  
				: null;	
				
				// Return  as a JSON response
				$data = ['status' => true,'message'=> 'Company profile is  ready.', 'companyProfile'=>$companyProfile  ]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				// $data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				  $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}


	//function for update company logo
	function updateCompanyLogo( Request $request)
	{
		 $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg|max:5120', // 2MB max
             
        ]);
				
				
			try
			{
				$user = JWTAuth::parseToken()->authenticate();
				if($user->company == null) 
				{
						$data = ['status' => false,'message'=> 'User does not have a registered company.'  ]; 
						return response()->json($data);
				} 
				 // Find the user's company
        $company = Company::where('user_id', $user->id)->firstOrFail();
				
				// Handle the logo upload
        if ($request->hasFile('logo')) {
					
						// If an old logo exists, delete it 
						$logoPath = 'company_logo/' . $company->logo;
							if (Storage::disk('public')->exists($logoPath)) {  
                Storage::disk('public')->delete($logoPath);
							} 

            // Generate a new file name for the logo
            $logoFileName = 'company_' . $company->id . '_logo.' . $request->file('logo')->extension();

            // Save the new logo to the public folder
            //$request->file('logo')->move(public_path('company_logo/'), $logoFileName);
						$request->file('logo')->storeAs('company_logo', $logoFileName, 'public');

            

            // Update the company logo in the database
            $company->logo = $logoFileName;
            $company->save();

						 //getting full url of logo
						$company->logo = $company->logo
						? url(Storage::url('company_logo/' . $company->logo))  
						: null;	
				
				
            return response()->json([
                'status' => true,
                'message' => 'Company logo updated successfully.',
                'logo' => $company->logo
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'No logo file was uploaded.'
            ]);
        }
			}
			catch(Exception $e)
			{
				// $data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				  $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}

	
	
	//function for update company  Description
	function updateCompanyDescription( Request $request)
	{
		 $request->validate([
             'description' => 'required|string', 
        ]);
				
				
			try
			{
				$user = JWTAuth::parseToken()->authenticate();
				if($user->company == null) 
				{
						$data = ['status' => false,'message'=> 'User does not have a registered company.'  ]; 
						return response()->json($data);
				} 
				 // Find the user's company
        $company = Company::where('user_id', $user->id)->firstOrFail();
				
				 
				// Update the company description in the database
				$company->description = $request->description;
				$company->save();

				return response()->json([
						'status' => true,
						'message' => 'Company description updated successfully.', 
				]);
        
			}
			catch(Exception $e)
			{
				// $data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				  $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}


	//function for update company  website,address,email, phone
	function updateCompanyContactDetail( Request $request)
	{
		 $request->validate([
				'website' => 'required|url', 
				'address' => 'required|string|max:500',
				'email' => 'required|email|max:255',
				'phone' => 'required|string|max:20',
		 ]);
				
				
			try
			{
				$user = JWTAuth::parseToken()->authenticate();
				if($user->company == null) 
				{
						$data = ['status' => false,'message'=> 'User does not have a registered company.'  ]; 
						return response()->json($data);
				} 
				 // Find the user's company
        $company = Company::where('user_id', $user->id)->firstOrFail();
				
				 
				// Update the company website,address,email, phone in the database
				$company->website = $request->website;
				$company->address = $request->address;
				$company->email = $request->email;
				$company->phone = $request->phone;
				$company->save();

				return response()->json([
						'status' => true,
						'message' => 'Company contact detail updated successfully.', 
				]);
        
			}
			catch(Exception $e)
			{
				// $data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				  $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}

	//function for update company  name,industry,established_year
	function updateCompanyBasicDetail(Request $request)
	{
		 $request->validate([
				'name' => 'required|string|max:255', 
				'industry' => 'required|string|max:255',	 
				'established_year' => 'required|integer|min:1900|max:' . date('Y'),  
		 ]);
				
				
			try
			{
				$user = JWTAuth::parseToken()->authenticate();
				if($user->company == null) 
				{
						$data = ['status' => false,'message'=> 'User does not have a registered company.'  ]; 
						return response()->json($data);
				} 
				 // Find the user's company
        $company = Company::where('user_id', $user->id)->firstOrFail();
				
				 
				// Update the company name,industry,established_year  in the database
				$company->name = $request->name;
				$company->industry = $request->industry;
				$company->established_year = $request->established_year;
				$company->save();

				return response()->json([
						'status' => true,
						'message' => 'Company basic detail updated successfully.', 
				]);
        
			}
			catch(Exception $e)
			{
				// $data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				  $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}



}
