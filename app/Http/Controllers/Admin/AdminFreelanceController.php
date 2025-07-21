<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Freelance;
use JWTAuth;
use Exception;
class AdminFreelanceController extends Controller
{
    //
		function getFreelanceList()
		{
			try
			{ 
			
				$freelanceList = Freelance::
				select('id', 'user_id', 	'title',  'budget_min',  'budget_max', 'created_at', 'deadline')
				->with(['user:id,userID'])
				->withCount('bids')
				->orderBy('id', 'desc')
				->cursorPaginate(25);
				
				
				return response()->json([
            'status' => true,
            'message' => 'Freelance list fetched successfully.',
            'freelanceList' => $freelanceList,
             
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
