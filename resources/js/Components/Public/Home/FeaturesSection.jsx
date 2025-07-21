 

    
import { BsGlobe2, BsChatDots, BsPeopleFill, BsImage, BsQuestionCircle, BsClipboardCheck, BsFileLock, BsBroadcast, BsNewspaper, BsBriefcase, BsCamera } from 'react-icons/bs';  


const FeaturesSection = () => {
	 
const features = [
    {
      icon: <BsGlobe2 className="" />, // teal/cyan
			bgColor: "bg-info-subtle",
      title: 'Explore',
      description: 'Discover professionals, stories, posts, and trends across industries.',
    },
    {
      icon: <BsChatDots className=" " />, // blue
			bgColor: "bg-primary-subtle",
      title: 'Chat',
      description: 'Real-time messaging to collaborate and connect instantly.',
    },
    {
      icon: <BsPeopleFill className=" " />, // green
			bgColor: "bg-success-subtle",
      title: 'Community',
      description: 'Join interest-based groups and build meaningful networks.',
    },
    {
      icon: <BsImage className=" " />, // yellow/orange
			bgColor: "bg-warning-subtle",
      title: 'Workfolio',
      description: 'Showcase your projects, case studies, and career milestones.',
    },
    {
      icon: <BsQuestionCircle className="" />, // red
			bgColor: "bg-danger-subtle",
      title: 'Problem Discussion',
      description: 'Ask and answer real industry questions with peers.',
    },
    {
      icon: <BsBriefcase className="" />, // muted gray (for jobs)
			bgColor: "bg-secondary-subtle",
      title: 'Jobs & Freelance Gigs',
      description: 'Find curated jobs and gigs tailored to your skills and goals.',
    },
    // New features added below:
    {
      icon: <BsBroadcast className="" />, // blue
			bgColor: "bg-light-subtle",
      title: 'Live Stream',
      description: 'Host live streams to engage with your audience in real-time.',
    },
    {
      icon: <BsCamera className=" " />, // blue-gray (for stories)
			bgColor: "bg-dark-subtle",
      title: 'Stories',
      description: 'Share your personal or professional stories to inspire others.',
    },
    {
      icon: <BsNewspaper className="" />, // green (for posts)
			bgColor: "bg-body-secondary",
      title: 'Posts',
      description: 'Create and share posts with your network to gain visibility and feedback.',
    },
  ];

  return (
    <section className="py-5 px-2 px-md-3 px-lg-4 px-xl-5   " id="features">
      <div className="text-center mb-5">
				<h2 className="  fw-bold">Our Key Features</h2>
				<p className="lead text-muted">
					Discover the amazing tools and features that will help you grow and connect.
				</p>
			</div>
      <div className="featuresSection">
         
					{features.map((feature, index) => (
						 
							<div key={index}  className={`feature_card p-4 rounded-4 ${feature.bgColor}	`} >
								<strong className="fs-5 fw-bold d-block mb-2"> 
									{feature.icon} {feature.title}
								</strong>
								<p  >{feature.description}</p>
							</div>
						 
					))}
          
      </div>    
      
    </section>
  );
};

export default FeaturesSection;
