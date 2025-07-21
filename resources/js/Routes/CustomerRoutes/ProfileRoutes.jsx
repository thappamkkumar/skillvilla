import { lazy } from 'react';
import { Route,   } from 'react-router-dom';
  
import UserProfilePage from '../../Pages/Customer/ProfilePage/UserProfilePage';
import FollowersPage from '../../Pages/Customer/ProfilePage/FollowersFollowing/FollowersPage';
import FollowingsPage from '../../Pages/Customer/ProfilePage/FollowersFollowing/FollowingsPage';
import UpdateProfilePage from '../../Pages/Customer/ProfilePage/UpdateProfile/UpdateProfilePage';


const ProfileRoutes = () => (
    <> 
			<Route path="profile" element={<UserProfilePage />} />
			<Route path="profile/update-profile" element={<UpdateProfilePage />} />
			<Route path="user/:userId/:ID/profile" element={<UserProfilePage />} />
			<Route path="user/:userId/:ID/followers" element={<FollowersPage />} />
			<Route path="user/:userId/:ID/followings" element={<FollowingsPage/>} />
															
		</>
);

export default ProfileRoutes;
