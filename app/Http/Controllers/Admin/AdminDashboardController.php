<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Traits\GrowthDataTrait;

use App\Models\User;
use App\Models\Community;
use App\Models\Stories;
use App\Models\Post;
use App\Models\Problem;
use App\Models\Workfolio;
use App\Models\CompanyJob;
use App\Models\Freelance;
use App\Models\Company;

use JWTAuth;
use Exception;
use Carbon\Carbon;
class AdminDashboardController extends Controller
{
	 use GrowthDataTrait;
			
    //function use for get or fetch chat list
		function getDashboardInfo(Request $request)
		{
			try
			{
				
				// Authenticate the user using JWT if no search input is provided
				//$user = JWTAuth::parseToken()->authenticate();
        
				$yearYearly = $request->input('year_yearly', 2024	);
				$yearDaily = $request->input('year_daily', Carbon::now()->year);
        $monthDaily = $request->input('month_daily', Carbon::now()->month);

				
				$totalUser= User::count();
				$totalStories= Stories::count();
				$totalCommunity= Community::count();
				$totalPost= Post::count();
				$totalProblem= Problem::count();
				$totalWorkfolio= Workfolio::count();
				$totalCompanyJob= CompanyJob::count();
				$totalFreelance= Freelance::count();
				$totalCompany= Company::count();
				
				$totalStats = [
					'totalUser'=> $totalUser, 
					'totalStories'=> $totalStories, 
					'totalCommunity'=> $totalCommunity, 
					'totalPost'=> $totalPost, 
					'totalWorkfolio'=> $totalWorkfolio, 
					'totalCompanyJob'=> $totalCompanyJob, 
					'totalFreelance'=> $totalFreelance, 
					'totalProblem'=> $totalProblem, 
					'totalCompany'=> $totalCompany, 
				
				];
				
			 
         // Fetch yearly and weekly growth data
					$yearlyGrowth = $this->getYearlyGrowthData($yearYearly);
          $dailyGrowth = $this->getDailyGrowthData($yearDaily, $monthDaily);


        // Return JSON response
        return response()->json([
            'status' => true,
            'message' => 'Dashboard info is ready.',
            'totalStats' => $totalStats, 
            'yearlyGrowth' => $yearlyGrowth, 
            'dailyGrowth' => $dailyGrowth, 
             
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
