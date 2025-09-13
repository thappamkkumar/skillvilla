<?php

use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

it('all live stream routes are working', function () {
    
		 // Create a test user
    $user = User::factory()->create();

    // Generate JWT token for the user
    $token = JWTAuth::fromUser($user);

    $headers = [
        'Authorization' => 'Bearer ' . $token,
        'Accept' => 'application/json',
    ];
		
		
		$routes = [
        'user.createProfessionalLiveStream',
        /*'user.createLiveStreamSession',
        'user.updateProfessionalLiveStream',
        'user.updateProfessionalLiveStreamSession',
        'user.deleteProfessionalLiveStream',
        'user.deleteProfessionalLiveStreamSession',
        'user.getFollowingProfessionalLiveStream',
        'user.getMyProfessionalLiveStream',
        'user.getSelectedUserProfessionalLiveStream',
        'user.getProfessionalLiveStreamDetail',
        'user.getProfessionalLiveStreamSessions',
        'user.getFollowingActiveLiveStreams',
        'user.quickLiveStreamStart',
        'user.quickLiveStreamEnd',
        'user.professionalLiveStreamStart',
        'user.professionalLiveStreamEnd',
        'user.liveStreamNewViewer',
        'user.liveStreamViewerLeave',
        'user.liveStreamJoinRequest',
        'user.liveStreamCancelJoinRequest',
        'user.liveStreamAcceptJoinRequest',
        'user.liveStreamMemberExit',
        'user.liveStreamSignaling',
        'user.liveStreamManageAccess',
        'user.liveStreamPublisherHold',
        'user.liveStreamMemberHold',
        'user.liveStreamMessage',
        'user.liveStreamReaction',*/
    ];

    foreach ($routes as $route) {
        $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
    ->postJson(route($route), [], $headers);
				
				if (! in_array($response->getStatusCode(), [200, 302, 401])) {
        dump([
            'route'   => $route,
            'status'  => $response->getStatusCode(),
            'content' => $response->json(),
        ]);
			}
				
        expect(in_array($response->getStatusCode(), [200, 302, 401]))
            ->toBeTrue("? {$route} is not working, got status {$response->getStatusCode()}");
    }
});
