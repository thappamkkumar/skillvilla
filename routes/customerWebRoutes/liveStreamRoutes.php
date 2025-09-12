<?php

 use App\Http\Controllers\User\LiveStreamController;
 use Illuminate\Support\Facades\Route;
 
 Route::controller(LiveStreamController::class)->group(
	function(){
		
		
		//CREATE PROFESSIONAL LIVE AND SESSION
		
		//Route for create professional live stream 
		Route::post('create-professional-live-stream', 'createProfessionalLiveStream')->name('user.createProfessionalLiveStream');
		
		//Route for create session professional for live stream
		Route::post('create-live-stream-session', 'createLiveStreamSession')->name('user.createLiveStreamSession');
		
		
	//------------------------------------------------------------------------------	
	//------------------------------------------------------------------------------	
		
		
		//UPDATE PROF. LIVE AND SESSION
	
		//Route for update professional live stream 
		Route::post('update-professional-live-stream', 'updateProfessionalLiveStream')->name('user.updateProfessionalLiveStream');
		
		//Route for update session of professional live stream
		Route::post('update-professional-live-stream-session', 'updateProfessionalLiveStreamSession')->name('user.updateProfessionalLiveStreamSession');
		
		
	
	//------------------------------------------------------------------------------	
	//------------------------------------------------------------------------------	
		
		
		//DELETE PROF. LIVE AND SESSIONS
		
		//route for delete professional live stream
		Route::post('delete-professional-live-stream', 'deleteProfessionalLiveStream')->name('user.deleteProfessionalLiveStream');
		
		//route for delete session of professional live stream
		Route::post('delete-professional-live-stream-session', 'deleteProfessionalLiveStreamSession')->name('user.deleteProfessionalLiveStreamSession');
		
		
		
	
	//------------------------------------------------------------------------------	
	//------------------------------------------------------------------------------	
		
		
		// GET PROF. LIVE STREAM (FOLLWING, MY, SELECTED USER) AND SESSIONS
		
		
		//Route for get professional live stream list of user followings 
		Route::post('get-following-professional-live-stream', 'getFollowingProfessionalLiveStream')->name('user.getFollowingProfessionalLiveStream');
		
		//Route for  get my professional live stream  
		Route::post('get-my-professional-live-stream', 'getMyProfessionalLiveStream')->name('user.getMyProfessionalLiveStream');
		
		//Route for  get selected user professional live stream  
		Route::post('get-selected-user-professional-live-stream', 'getSelectedUserProfessionalLiveStream')->name('user.getSelectedUserProfessionalLiveStream');
		
		//Route for get detail of professional live stream 
		Route::post('get-professional-live-stream-detail', 'getProfessionalLiveStreamDetail')->name('user.getProfessionalLiveStreamDetail');
		
		//Route for get session of professional live stream 
		Route::post('get-professional-live-stream-sessions', 'getProfessionalLiveStreamSessions')->name('user.getProfessionalLiveStreamSessions');
		
		
		
	//------------------------------------------------------------------------------	
	//------------------------------------------------------------------------------	
		
		
		//GET ACTIVE LIVE STREAM
		
		//Route for get active live stream (quick and professional)
		Route::post('get-following-active-live-streams', 'getFollowingActiveLiveStreams')->name('user.getFollowingActiveLiveStreams');
		
		
		
		
	//------------------------------------------------------------------------------	
	//------------------------------------------------------------------------------	
	
	
		//QUICK LIVE CREATE (go live) AND END 
		
		//route for quick live start
		Route::post('quick-live-stream-start', 'quickLiveStreamStart')->name('user.quickLiveStreamStart');
		
		//Route for  quick live stream end
		Route::post('quick-live-stream-end', 'quickLiveStreamEnd')->name('user.quickLiveStreamEnd');
		
	
	//------------------------------------------------------------------------------	
	//------------------------------------------------------------------------------	
	
	
		//PROF. LIVE SESSION GO LIVE 
		
		//route for professional live stream start  
		Route::post('professional-live-stream-start', 'professionalLiveStreamStart')->name('user.professionalLiveStreamStart');
		
		//route for professional live stream end
		Route::post('professional-live-stream-end', 'professionalLiveStreamEnd')->name('user.professionalLiveStreamEnd');
	
	//------------------------------------------------------------------------------	
	//------------------------------------------------------------------------------	
	
	
	
	 
	  
		
		//VIEWER  JOIN AND LEAVE
		
		//Route for viewer start watching or viewing live sream
		Route::post('live-stream-new-viewer', 'liveStreamNewViewer')->name('user.liveStreamNewViewer');
		
		//Route for viewer leave stream 
		Route::post('live-stream-viewer-leave', 'liveStreamViewerLeave')->name('user.liveStreamViewerLeave');
		
		
		
		//JOIN REQUEST FOR MEMBER, CANCEL, ACCEPT, 
		
		//Route for join request to live stream 
		Route::post('live-stream-join-request', 'liveStreamJoinRequest')->name('user.liveStreamJoinRequest');
		 
		//Route for cancel live stream  join request
		Route::post('live-stream-cancel-join-request', 'liveStreamCancelJoinRequest')->name('user.liveStreamCancelJoinRequest');
		
		//Route for accept live stream join request
		Route::post('live-stream-accept-join-request', 'liveStreamAcceptJoinRequest')->name('user.liveStreamAcceptJoinRequest');
		
		
	

		//MEMBER EXIT
		
	
		//Route for exiting from member list  of live stream 
		Route::post('live-stream-member-exit', 'liveStreamMemberExit')->name('user.liveStreamMemberExit');
		
		
		
		//WEBRTC SIGNALING
		
		
		//Route for live stream signaling
		Route::post('live-stream-signaling', 'liveStreamSignaling')->name('user.liveStreamSignaling');
		
		
		
		//PUBLISHER->  MANAGE ACCESS, HOLD LIVE, HOLD MEMBER 
		
		
		//Route for manage access of (MEMBER AND VIEWER) for live stream 
		Route::post('live-stream-manage-access', 'liveStreamManageAccess')->name('user.liveStreamManageAccess');
		
		//Route for publisher hold live stream 
		Route::post('live-stream-publisher-hold', 'liveStreamPublisherHold')->name('user.liveStreamPublisherHold');
		
		//Route for live stream member hold  
		Route::post('live-stream-member-hold', 'liveStreamMemberHold')->name('user.liveStreamMemberHold');
		
		
		
		
		//MESSAGE AND REATION
		
		//Route for live stream chat or messages 
		Route::post('live-stream-massage', 'liveStreamMessage')->name('user.liveStreamMessage');
		
		//route for live stream reaction
		Route::post('live-stream-reaction', 'liveStreamReaction')->name('user.liveStreamReaction');
		
		
	}
 );
 