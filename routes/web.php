<?php

use Illuminate\Support\Facades\Route; 

//admin controllers
use App\Http\Controllers\Admin\AdminDashboardController; 

//import middleware
//use App\Http\Middleware\AdminMiddleware; 

Route::get('/', function () {
    return view('welcome');
});
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');


/* ******** PUBLIC ROUTES ******* */
Route::middleware('api')->group(function () { 
	
	//route for authentication .
	require_once __DIR__.'/publicWebRoutes/authenticationRoutes.php';	
	
	//route for public contact .
	require_once __DIR__.'/publicWebRoutes/contactRoutes.php';	
});		
			
			
			
	/* ******** CUSTOMER ROUTES ******* */
	
// Protected Customer API routes (auth required)
Route::middleware(['api', 'auth:api'])->group(function () {
	
	//Route group controller for customer home
	require_once __DIR__.'/customerWebRoutes/homeRoutes.php';	
		
		//Route group controller for post operation like fetch upload/post, edit and delete
	require_once __DIR__.'/customerWebRoutes/postRoutes.php';	
		
		
	//Route group controller for user profile 
  require_once __DIR__.'/customerWebRoutes/userProfileRoutes.php';
		
	//Route group controller for chat 
  require_once __DIR__.'/customerWebRoutes/chatRoutes.php';
	
	//Route group controller for chat calls 
  require_once __DIR__.'/customerWebRoutes/chatCallRoutes.php';
	
	//Route group controller for Workfolio
  require_once __DIR__.'/customerWebRoutes/workfolioRoutes.php';	
		 
		
	//Route group controller for problems
  require_once __DIR__.'/customerWebRoutes/problemRoutes.php';	
	 
	//Route group controller for Stories
   require_once __DIR__.'/customerWebRoutes/storyRoutes.php';	
		                                     
	//Route group controller for Company Job Vacancy
   require_once __DIR__.'/customerWebRoutes/jobRoutes.php';	
		                                        
	//Route group controller for Company  
   require_once __DIR__.'/customerWebRoutes/companyRoutes.php';
		
	//Route group controller for freelance Job or work
  require_once __DIR__.'/customerWebRoutes/freelanceRoutes.php';
		
	//Route group controller for freelance Job or work
   require_once __DIR__.'/customerWebRoutes/freelanceBidRoutes.php'; 
		
	//Route group controller for explore feature
  require_once __DIR__.'/customerWebRoutes/exploreRoutes.php';
	
	//Route group controller for communities feature
   require_once __DIR__.'/customerWebRoutes/communityRoutes.php'; 
	 
	//Route group controller for communities messages feature
  require_once __DIR__.'/customerWebRoutes/communityMessageRoutes.php';
});		 
		
		
		
		
		
		
	/* ******** ADMIN ROUTES ******* */	
	Route::middleware(['api', 'auth:api', 'adminRole'])->prefix('admin')->group(function () {
			
			//Route group controller for dashborad
			require_once __DIR__.'/adminWebRoutes/dashboardRoutes.php';
			
			//Route group controller for community 
			require_once __DIR__.'/adminWebRoutes/communityRoutes.php';
			
			//Route group controller for company 
			require_once __DIR__.'/adminWebRoutes/companyRoutes.php';
			
			//Route group controller for freelance 
			require_once __DIR__.'/adminWebRoutes/freelanceRoutes.php';
		
			//Route group controller for jobs 
			require_once __DIR__.'/adminWebRoutes/jobRoutes.php';
			
			//Route group controller for post 
			require_once __DIR__.'/adminWebRoutes/postRoutes.php';
		
			//Route group controller for problem 
			require_once __DIR__.'/adminWebRoutes/problemRoutes.php';
			
			//Route group controller for story 
			require_once __DIR__.'/adminWebRoutes/storyRoutes.php';
		
			//Route group controller for user 
			require_once __DIR__.'/adminWebRoutes/userRoutes.php';
			
			//Route group controller for workfolio 
			require_once __DIR__.'/adminWebRoutes/workfolioRoutes.php';
		
			//Route for admin profile
			require_once __DIR__.'/adminWebRoutes/adminProfileRoutes.php';
			
			
		 //Route for admin messages
			require_once __DIR__.'/adminWebRoutes/adminMessageRoutes.php';
			
		 
	});
		
