<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Problem;
use JWTAuth;
use Exception;
class AdminProblemController extends Controller
{
    //
		function getPromblemList()
		{
			try
			{ 
			
				$problemList = Problem::
				select('id', 'title',   'created_at', 'user_id')
				->with([
							'user:id,userID', 							
					])
				->withCount('solutions') 
				->orderBy('id', 'desc')->cursorPaginate(25);
				
				
				return response()->json([
            'status' => true,
            'message' => 'Problem list fetched successfully.',
            'problemList' => $problemList,
             
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
