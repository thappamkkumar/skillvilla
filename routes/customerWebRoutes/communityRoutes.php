<?php

use App\Http\Controllers\User\CommunitiesController;
use Illuminate\Support\Facades\Route;

	  Route::controller(CommunitiesController::class)->group(
			function (){
			 
				//Route for fetching communities created by logged users or other selected user 
				Route::post('/get-user-communities', 'getUserCommunities')->name('user.getUserCommunities');
				//Route for fetching joined communities  
				Route::post('/get-joined-communities', 'getJoinedCommunities')->name('user.getJoinedCommunities');
				//Route for fetching suggestion communities 
				Route::post('/get-suggestion-communities', 'getSuggestionCommunities')->name('user.getSuggestionCommunities');
				//Route for Joining the community
				Route::post('/communities/join', 'joinCommunity')->name('user.joinCommunity');
				//Route for Request the community
				Route::post('/communities/request', 'requestCommunity')->name('user.requestCommunity');
				//Route for leave the community
				Route::post('/communities/leave', 'leaveCommunity')->name('user.leaveCommunity');
				//Route create new community
				Route::post('/communities/create-new', 'createNewCommunity')->name('user.createNewCommunity');
				
				//Route for getting community detail
				Route::post('/get-community-detail', 'getCommunityDetail')->name('user.getCommunityDetail');
				
				//Route for getting community members
				Route::post('/get-community-members', 'getCommunityMembers')->name('user.getCommunityMembers');
				//Route for   community members
				//Route::post('/community/role-updation', 'memberRoleUpdation')->name('user.memberRoleUpdation');
				
				//Route for   community members content-share-access-updation
				Route::post('/community/content-share-access-updation', 'memberContentShareAccessUpdation')->name('user.memberContentShareAccessUpdation');
				//Route for  removeing community member  
				Route::post('/community/remove-member', 'removeCommunityMember')->name('user.removeCommunityMember');
				
				
				//Route for getting community request
				Route::post('/get-community-request', 'getCommunityRequest')->name('user.getCommunityRequest');
				//Route for  request status updation  
				Route::post('/community/request-status-updation', 'requestStatusUpdation')->name('user.requestStatusUpdation');
				
				
		 
				
				//Route for getting community posts
				Route::post('/get-community-post', 'getCommunityPosts')->name('user.getCommunityPosts');
				//Route for getting community workfolios
				Route::post('/get-community-workfolios', 'getCommunityWorkfolios')->name('user.getCommunityWorkfolios');
				//Route for getting community problems
				Route::post('/get-community-problems', 'getCommunityProblems')->name('user.getCommunityProblems');
				//Route for getting community jobs
				Route::post('/get-community-jobs', 'getCommunityJobs')->name('user.getCommunityJobs');
				//Route for getting community freelance
				Route::post('/get-community-freelances', 'getCommunityFreelances')->name('user.getCommunityFreelances');
				
				//Route for deleting community 
				Route::post('/delete-community', 'deleteComunity')->name('user.deleteComunity');
				//Route for update community  image
				Route::post('/community/update-image', 'updateCommunityImage')->name('user.updateCommunityImage');
				//Route for update community  detail
				Route::post('/community/update-detail', 'updateCommunityDetail')->name('user.updateCommunityDetail');
			 
			 //route for fetch communities for share post, problem, workfolio, jobs, freelance etc
				Route::post('/get-communities-for-share', 'getCommunitiesForShare')->name('user.getCommunitiesForShare');
				//route for share  with communities
				Route::post('/share-with-communities', 'shareWithCommunities')->name('user.shareWithCommunities');
			
			}                                        
		);       
		