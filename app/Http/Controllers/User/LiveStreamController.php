<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


use App\Models\LiveStream;
//use App\Models\LiveQuickStream;
//use App\Models\LiveQuickStreamViewer;
//use App\Models\LiveProfessionalStreamSessionViewer;
//use App\Models\LiveProfessionalStreamSession;
//use App\Models\LiveProfessionalStreamCategory;
//use App\Models\LiveProfessionalStream;
//use App\Models\LiveStreamMessages;
 
 
use App\Events\LiveStream\Ended;
use App\Events\LiveStream\Hold;
use App\Events\LiveStream\JoinedRequest;
use App\Events\LiveStream\JoinRequestAccepted;
use App\Events\LiveStream\JoinRequestCancelled;
use App\Events\LiveStream\Message;
use App\Events\LiveStream\Reaction;
use App\Events\LiveStream\Signal;
use App\Events\LiveStream\Started;
use App\Events\LiveStream\ViewerHold;
use App\Events\LiveStream\ViewerJoined;
use App\Events\LiveStream\ViewerLeft;
use App\Events\LiveStream\ViewerPaused; 
 

use JWTAuth;
use Exception;

class LiveStreamController extends Controller
{
    //Function for creating professional live stream 
		function createProfessionalLiveStream(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		//professional live stream session 
		function createLiveStreamSession(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		//update professional stream 
		function updateProfessionalLiveStream(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		
		//update session of professoinal live stream 
		function updateProfessionalLiveStreamSession(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		
		//delete professional stream 
		function deleteProfessionalLiveStream(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//delete session of professional stream 
		function deleteProfessionalLiveStreamSession(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//get professional live stream of followings (user whom logged user follow)
		function getFollowingProfessionalLiveStream(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//get professional live stream of current user
		function getMyProfessionalLiveStream(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//get professional live stream of any selected user 
		function getSelectedUserProfessionalLiveStream(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
	
		//get detail of professional live stream 
		function getProfessionalLiveStreamDetail(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		
		//get sessions of professional live stream 
		function getProfessionalLiveStreamSessions(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//get active live stream (quick and professional)
		function getFollowingActiveLiveStreams(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		// quick live stream start by publisher
		function quickLiveStreamStart(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAuth::parseToken()->authenticate();
				
				// Start a database transaction (so if one fails, both rollback)
        DB::beginTransaction();
				
				// 1. Create LiveStream
				$liveStream = LiveStream::create(['publisher_id'=> $user->id	]);
				
				  // 2. Create QuickStream linked to LiveStream
				$liveStream->quickStreams()->create([
            'is_recording' => false,
            'started_at'   => now(),
            'on_hold'      => false,
            'can_chat'     => true,
            'speaker_off'  => false,
            'camera_off'   => false,
            'mic_off'      => false,
        ]);
				
				// End  database transaction 
        DB::commit();
				
				 //   Load quickStreams and publisher into the liveStream model
         $liveStream->load([
            'quickStreams',
            'publisher:id,userID,name', // adjust to your actual User columns
            'publisher.customer:id,user_id,image'
        ]);

				 
       
				
				$quickStream = $liveStream->quickStreams->last(); // collection helper
				
				
				if ($liveStream->publisher->customer != null && !filter_var($liveStream->publisher->customer->image, FILTER_VALIDATE_URL)) 
				{ 
					$liveStream->publisher->customer->image = $liveStream->publisher->customer->image
					? url(Storage::url('profile_image/' . $liveStream->publisher->customer->image))  
					: null; 
				}	
				
				
				// Example: fetch followers of logged-in user
				$followers = $user->followers()->pluck('follower_id'); // adjust relation name
				 
						
				//dispatch event for broadcast 
				Started::dispatch([
								'follower_ids' => $followers,
								'publisher'=> $liveStream->publisher ,
								'live_stream_id' => $liveStream->id,
								'live_type' => 'quick', 
								'started_at'=> $quickStream->started_at,
						]);
				 				
				 
				
				
				
				$data = [
						'status'  => true,
						'message' => 'LiveStream and QuickStream created successfully.',
						'data'    => [
								'live_stream' => [
										'id'           => $liveStream->id,
										'publisher' => $liveStream->publisher ,
										'live_type' => 'quick' ,
									  'started_at'    => $quickStream->started_at,
										 
								],
						],
				];

				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//quick live stream end
		function quickLiveStreamEnd(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//professional live stream start
		function professionalLiveStreamStart(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//professional live srteam end
		function professionalLiveStreamEnd(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}
		
		
		//add new viewer of live stream 
		function liveStreamNewViewer(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		// viewer live the live stream
		function liveStreamViewerLeave(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		// request for join as member of live stream  (by viewer)
		function liveStreamJoinRequest(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		// cancel live stream join request (by publisher)
		function liveStreamCancelJoinRequest(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		// accept live stream join request (by publisher)
		function liveStreamAcceptJoinRequest(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		//member exit the live stream (remove user from member, but still as viewer of live stream)
		function liveStreamMemberExit(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}



		// signaling for establish live stream webrtc connection 
		function liveStreamSignaling(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		//manageor (update) the access of viewer and members
		function liveStreamManageAccess(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		//live stream hold to all viewer or members (by publisher) 
		function liveStreamPublisherHold(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		//live stream hold (by member), only stop sharing data from member side, who put itself on hold
		function liveStreamMemberHold(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		// live stream messages
		function liveStreamMessage(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}


		// live stream reaction
		function liveStreamReaction(Request $request)
		{
			try
			{
				// Get logged-in user
				$user = JWTAUTH::parseToken()->authenticate();
				
				
				$data = ['status'=> true, 'message' => ''];
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false, 'message' => 'Oops! Something went wrong.',];
				$data = ['status' => false, 'message' => $e->getMessage(),];
				return response()->json($data);
			}
		}

 











}
