<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Workfolio;

use JWTAuth;
use Exception;
class AdminWorkfolioController extends Controller
{
    //
		function getWorkfolioList()
		{
			try
			{ 
			
				$workfolioList = Workfolio::
				select(['id', 'title', 'created_at', 'user_id'])
				->with([
					'user:id,userID', 
				])
				->withAvg('workfolioReview', 'rating')
				->withCount('workfolioReview')
				->orderBy('id', 'desc')->cursorPaginate(25);
				
				 
				
				return response()->json([
            'status' => true,
            'message' => 'Workfolio list fetched successfully.',
            'workfolioList' => $workfolioList,
             
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
