<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\CompanyJob;


use JWTAuth;
use Exception;
class AdminJobsController extends Controller
{
    //function for fetching jobs
		function getJobList()
		{
			try
			{ 
			
				$jobList = CompanyJob::
				select('id', 'user_id', 'title', 'salary', 'expires_at', 'created_at')
				->with(['user:id,userID'])
				->withCount('applications')
				->orderBy('id', 'asc')->cursorPaginate(25);
				
				
				return response()->json([
            'status' => true,
            'message' => 'Job list fetched successfully.',
            'jobList' => $jobList,
             
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
