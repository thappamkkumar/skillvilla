 

import {useState} from 'react';
import HeroSection from '../../Components/Public/Home/HeroSection'; 
import FeaturesSection from '../../Components/Public/Home/FeaturesSection';
import TestimonialSection from '../../Components/Public/Home/TestimonialSection';
import CTASection from '../../Components/Public/Home/CTASection';
import ContactSection from '../../Components/Public/Home/ContactSection';
 import PageSeo from '../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

const HomePage = () => {  
	
	 
	return ( 
		<>
		 <PageSeo 
				title="Welcome to SkillVilla"
				description="Showcase your skills, connect with professionals, and discover opportunities on SkillVilla."
				keywords="SkillVilla, professional network, portfolios, freelance, jobs"
			/>

			<div > 

				<HeroSection/>

				<FeaturesSection/>

				<TestimonialSection/>

				<CTASection />

				<ContactSection />
	 
			</div>
		</>
	);
};

export default HomePage;
