<?php

use Illuminate\Support\Facades\Broadcast;
/*
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
*/

// channel for  add new post  
Broadcast::channel('add-new-post', function ($user) {
    return true;
});

// channel for   post likes
Broadcast::channel('post-like', function ($user) {
    return true;
});

// channel for post comments
Broadcast::channel('post-comments', function ($user) {
    return true;
});

// channel for post comments count
Broadcast::channel('post-comments-count', function ($user) {
    return true;
});

// channel for post saved or remove from save list
Broadcast::channel('post-save', function ($user) {
    return true;
});

// channel for  delete post
Broadcast::channel('post-delete', function ($user) {
    return true;
});

// channel for update followers count of usr profile
Broadcast::channel('update-user-profile-followers-count', function ($user) {
    return true;
});

// channel for update followings count of usr profile
Broadcast::channel('update-user-profile-followings-count', function ($user) {
    return true;
});

// channel for update user profile
Broadcast::channel('update-user-profile', function ($user) {
    return true;
});
 
 
// channel for update message read status
Broadcast::channel('update-message-read-status', function ($user) {
    return true;
});


// channel for send message
Broadcast::channel('send-message', function ($user) {
    return true;
});


// channel for delete message
Broadcast::channel('chat-delete', function ($user) {
    return true;
});
 
 // channel for upload  or add new workfolio  
Broadcast::channel('add-new-workfolio', function ($user) {
    return true;
});

// channel for workfolio review add
Broadcast::channel('workfolio-review-add', function ($user) {
    return true;
});
 
// channel for workfolio avg and count updated
Broadcast::channel('workfolio-average-count-update', function ($user) {
    return true;
});
 
// channel for workfolio deleted
Broadcast::channel('workfolio-delete', function ($user) {
    return true;
});
 
 // channel for upload  or add new problem  
Broadcast::channel('add-new-problem', function ($user) {
    return true;
});

// channel for problem deleted
Broadcast::channel('problem-delete', function ($user) {
    return true;
});
 
 
// channel for problem solution count
Broadcast::channel('problem-solution-count', function ($user) {
    return true;
});
 
 
// channel for problem new solution  added
Broadcast::channel('problem-new-solution-add', function ($user) {
    return true;
});
 
 
// channel for delete problem  solution   
Broadcast::channel('delete-problem-solution', function ($user) {
    return true;
});
 
 
 
// channel for upload  or add new stories  
Broadcast::channel('add-new-stories', function ($user) {
    return true;
});
 
 // channel for upload  or add new stories  comment
Broadcast::channel('story-new-comment', function ($user) {
    return true;
});

  // channel for delete stories  
Broadcast::channel('delete-story', function ($user) {
    return true;
});
 
  // channel for  like story
Broadcast::channel('story-like', function ($user) {
    return true;
});
 
 
 // channel for  add new job
Broadcast::channel('add-new-job', function ($user) {
    return true;
});
 
 

 // channel for job delete
Broadcast::channel('job-delete', function ($user) {
    return true;
});
 
 

 // channel for add new job application
Broadcast::channel('add-new-job-application', function ($user) {
    return true;
});
 
 

 // channel for job application count
Broadcast::channel('job-application-count', function ($user) {
    return true;
}); 
  
 
 
 // channel for  add new freelance
Broadcast::channel('add-new-freelance', function ($user) {
    return true;
});
 
 

 // channel for freelance delete
Broadcast::channel('freelance-delete', function ($user) {
    return true;
});
 
 

 // channel for add new freelance bid
Broadcast::channel('add-new-freelance-bid', function ($user) {
    return true;
});
 
 

 // channel for freelance bid count
Broadcast::channel('freelance-bid-count', function ($user) {
    return true;
});
 
  
	
 // channel for community member count 
Broadcast::channel('community-member-count', function ($user) {
    return true;
});
 
   
// channel for join community  
Broadcast::channel('join-community', function ($user) {
    return true;
});
 
 
// channel for leave community  
Broadcast::channel('leave-community', function ($user) {
    return true;
});
 
   
// channel for community join request
Broadcast::channel('community-send-new-request', function ($user) {
    return true;
});
 

    
// channel for cancel community join request 
Broadcast::channel('cancel-community-join-request', function ($user) {
    return true;
});
 

// channel for   community   request count
Broadcast::channel('community-request-count', function ($user) {
    return true;
});
 
  
// channel for  remove community  member 
Broadcast::channel('remove-community-member', function ($user) {
    return true;
});

 
// channel for  accept community  join request 
Broadcast::channel('community-request-accepted', function ($user) {
    return true;
});
 
  
// channel for  reject community  join request 
Broadcast::channel('community-request-rejected', function ($user) {
    return true;
});


 // channel for  cancel community    request 
Broadcast::channel('community-request-cancel', function ($user) {
    return true;
});
 

// channel for  community new message
Broadcast::channel('community-new-message', function ($user) {
    return true;
});
 
  
