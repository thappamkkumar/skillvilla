<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Community;

use JWTAuth;
use Exception;

class AdminCommunitiesController extends Controller
{
    //function for fetch list of communities
		function getCommunityList(Request $request)
		{
			try
			{ 
			
				$communityList = Community::
				select(['id', 'name', 'created_by', 'image', 'privacy'])
				->with([
					'creator:id,userID'
				])
				->withCount('members')
				->orderBy('id', 'desc')->cursorPaginate(25);
				
				// Convert image paths to full URLs
         foreach ($communityList as $community) {
            $community->image = $community->image
                ? url(Storage::url('community_profile_image/' . $community->image))  
                : null;
        } 
				
				return response()->json([
            'status' => true,
            'message' => 'Community list fetched successfully.',
            'communityList' => $communityList,
             
        ]);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
		
		
		//function for   community detail
		function getCommunityDetail(Request $request)
		{
			try
			{ 
			
				if (!$request->has('communityId')) {
            return response()->json(['status' => false, 'message' => 'Community ID is required.'], 400);
					}
				
					$communityId = $request->communityId;
					
					 
					$communityDetail = Community::select(['id', 'name', 'description', 'privacy', 'created_by', 'content_share_access', 'image'])  
					->withCount(['members', 'requests'])					
					->findOrFail($communityId);
					 
					 	// Generate full image URL dynamically based on storage disk
					 $communityDetail->image = $communityDetail->image
            ? url(Storage::url('community_profile_image/' . $communityDetail->image)) 
            : null;
						 
					
					$data = [
						'status' => true,
						'message'=> 'Community  detail is  ready.', 
						'communityDetail' => $communityDetail
					]; 
					
					return response()->json($data);	
					
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
		
}
