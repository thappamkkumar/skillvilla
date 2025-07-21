<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable  implements JWTSubject
{
    use HasFactory, Notifiable;
		protected $table = 'users';
		
		const ROLE_CUSTOMER = 'Customer'; 
    const ROLE_ADMIN = 'Admin';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'userID', 'name', 'email', 'password', 'user_role', 'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
		
		 

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
						'is_active' => 'boolean'
					];
    }
		
		/**
		* Creating userID from user name  and id
		*
		* Also creating candidate and recruiter with user id
		*
		* @return array<string, string>
		*/ 
		protected static function boot()
    {
        parent::boot();
				//creating userID with name and id
        static::created(function ($user) {
             $userID = strtolower(str_replace(' ', '', $user->name)) . '_' . $user->id;
						$user->userID = $userID;
						$user->save();
				});
				//creating customer   with newly created user id
				static::created(function ($user) {
					 $customer = new Customer(['user_id' => $user->id]);
							$user->customer()->save($customer);
					 
			});
    }
		
		
		/**
		* Creating hasOne realtionship with candidate
		*
		* @return array<string, string>
		*/ 
    public function customer()
    {
        return $this->hasOne(Customer::class);
    }
		 
		/**
		* Creating hasOne realtionship with candidate
		*
		* @return array<string, string>
		*/ 
    public function admin()
    {
        return $this->hasOne(Admin::class);
    }
		 
		
		/**
		* Creating hasMany realtionship with post
		*
		* @return array<string, string>
		*/ 
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
		/**
		* Creating hasMany realtionship with post Comment
		*
		* @return array<string, string>
		*/ 
    public function comments()
    {
        return $this->hasMany(PostComment::class);
    }
		/**
		* Creating hasMany realtionship with post Like
		*
		* @return array<string, string>
		*/ 
    public function likes()
    {
        return $this->hasMany(PostLike::class);
    }
		/**
		* Creating hasMany realtionship with post save
		*
		* @return array<string, string>
		*/ 
    public function savedPost()
    {
        //return $this->hasMany(PostSave::class);
				return $this->belongsToMany(Post::class, 'post_saves');
    }
		/**
		* Creating many to many realtionship with post taged
		*
		* @return array<string, string>
		*/ 
		public function taggedPosts()
    {
        //return $this->belongsToMany(Post::class, 'post_tags')->withTimestamps();
        return $this->belongsToMany(Post::class, 'post_tags');
    }
		
		 
		/**
		* Creating hasMany realtionship with followers
		*
		* @return array<string, string>
		*/ 
		 public function followers()
    {
        return $this->hasMany(Follower::class, 'following_id', 'id');
    }
		/**
		* Creating hasMany realtionship with followers
		*
		* @return array<string, string>
		*/ 
    public function following()
    {
        return $this->hasMany(Follower::class, 'follower_id', 'id');
    } 
    
		 
		
		/**
		* Creating many to many realtionship with chatlist
		*
		* @return array<string, string>
		*/ 
		public function chats()
    {
        return $this->hasMany(ChatList::class, 'user_one_id')->orWhere('user_two_id', $this->id);
    }
		/**
		* Creating many to many realtionship with messages
		*
		* @return array<string, string>
		*/ 
    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
		
		
		/**
		* Creatinghas one realtionship with messages for shared user profile
		*
		* @return array<string, string>
		*/ 
    public function sharedUserMessage()
    {
        return $this->hasOne(Message::class, 'user_id');
    }
		
		
		
		 /**
     * Get all workfolios created by the user.
     */
    public function workfolios()
    {
        return $this->hasMany(Workfolio::class);
    }

    /**
     * Get all workfolio reviews written by the user.
     */
    public function workfoliosReviews()
    {
        return $this->hasMany(WorkfolioReview::class);
    }
		
		
		/**
     * Get all saved workfolio  
     */
    public function savedWorkfolio()
    {
        return $this->belongsToMany(Workfolio::class, 'workfolio_saves');
    }
		
		
		/**
     * Get the problems for the user.
     */
    public function problems()
    {
        return $this->hasMany(Problem::class); // User has many problems
    }
		
		
		/**
     * Get all saved problem  
     */
    public function savedProblem()
    {
        return $this->belongsToMany(Problem::class, 'problem_saves');
    }
		
		
		
		/**
     * Define the relationship with Solution (One user can have many solutions)
     */ 
    public function solutions()
    {
        return $this->hasMany(ProblemSolution::class);
    }
		
		
		/**
     * Get the stories for the user.
     */
    public function stories()
    {
        return $this->hasMany(Stories::class); // User has many stories
    }
		/**
		* Creating hasMany realtionship with stories Like
		*
		* @return array<string, string>
		*/ 
    public function storiesLikes()
    {
        return $this->hasMany(StoriesLike::class);
    }
		
		/**
		* Creating hasMany realtionship with stories Comment
		*
		* @return array<string, string>
		*/ 
    public function storiescomments()
    {
        return $this->hasMany(StoriesComment::class);
    }
		
		/**
		* Creating hasOne realtionship with company
		*
		* @return array<string, string>
		*/ 
    public function company()
    {
        return $this->hasOne(Company::class);
    }
		
		/**
		* Creating hasMany realtionship with company jobs
		*
		* @return array<string, string>
		*/ 
    public function job()
    {
        return $this->hasMany(CompanyJob::class);
    }
		/**
		* Creating hasMany realtionship with company jobApplication
		*
		* @return array<string, string>
		*/ 
    public function jobApplication()
    {
        return $this->hasMany(CompanyJobApplication::class);
    }
		/**
		* Creating hasMany realtionship with company jobSaved
		*
		* @return array<string, string>
		*/ 
    public function jobSaved()
    {
        return $this->hasMany(CompanyJobSaved::class);
    }	
		/**
		* Creating hasMany realtionship with company CompanyJobTestAttempt
		*
		* @return array<string, string>
		*/ 
    public function jobTestAttempt()
    {
        return $this->hasMany(CompanyJobTestAttempt::class);
    }
		
		
		
		
		
		
		
		/**
		* Creating hasMany realtionship with freelance jobs
		*
		* @return array<string, string>
		*/ 
    public function freelance()
    {
        return $this->hasMany(Freelance::class);
    }
		/**
		* Creating hasMany realtionship with Freelance bids
		*
		* @return array<string, string>
		*/ 
    public function freelanceBids()
    {
        return $this->hasMany(FreelanceBid::class);
    }
		/**
		* Creating hasMany realtionship with freelance Saved
		*
		* @return array<string, string>
		*/ 
    public function freelanceSaved()
    {
        return $this->hasMany(FreelanceSave::class);
    }	
		
		 /**
     * Reviews received by this user as a freelancer.
     */
    public function freelancerReviewsReceived()
    {
        return $this->hasMany(HirerReview::class, 'freelancer_id');
    }
		/**
     * Reviews received by this user as a hirer.
     */
    public function hirerReviewsReceived()
    {
        return $this->hasMany(FreelancerReview::class, 'hirer_id');
    }
		
		
		/**
     * Get the communities created by the user.
     */
    public function createdCommunities()
    {
        return $this->hasMany(Community::class, 'created_by');
    }

    /**
     * Get the communities where the user is a member.
     */
    public function communityMemberships()
    {
        return $this->hasMany(CommunityMember::class);
    }

		 /**
     * Relationship for community join requests.
     */
    public function communityRequests()
    {
        return $this->hasMany(CommunityRequest::class);
    }
		/**
     * Relationship for community messages.
     */
		public function communityMessage() {
				return $this->hasMany(CommunityMessage::class);
		}

		/**
		* Creating many to many realtionship  
		* 
		* @return array<string, string>
		*/  
		//User can share multiple posts with communities
    public function communitySharedPosts()
    {
        return $this->hasMany(CommunityPost::class, 'sender_id');
    }
		
		/**
		* Creating many to many realtionship  
		*  
		* @return array<string, string>
		*/  
    // User can share multiple workfolios with communities
    public function communitySharedWorkfolios()
    {
        return $this->hasMany(CommunityWorkfolio::class, 'sender_id');
    }
		
		/**
		* Creating many to many realtionship  
		*  
		* @return array<string, string>
		*/  
		// User can share multiple problems with communities
    public function communitySharedProblems()
    {
        return $this->hasMany(CommunityProblem::class, 'sender_id');
    }
		
		/**
		* Creating many to many realtionship  
		*  
		* @return array<string, string>
		*/   
    // User can share multiple jobs with communities
    public function communitySharedJobs()
    {
        return $this->hasMany(CommunityJob::class, 'sender_id');
    }
		
		/**
		* Creating many to many realtionship  
		*  
		* @return array<string, string>
		*/   
    // User can share multiple Freelances with communities
    public function communitySharedFreelances() 
		{
				return $this->hasMany(CommunityFreelance::class, 'sender_id');
		}

		
		
		
		
		
		/**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
