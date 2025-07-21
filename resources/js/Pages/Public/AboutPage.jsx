import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageSeo from '../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

const AboutPage = () => {
  return (
		<>
			<PageSeo 
				title="About | SkillVilla"
				description="Learn more about SkillVilla — the platform built to connect professionals, showcase talent, and unlock opportunities."
				keywords="about SkillVilla, platform info, professional network, SkillVilla mission"
			/>

			<section id="about" className="py-5">
				<Container>
					<Row className="text-center mb-4">
						<Col>
							<h2 className="fw-bold">About SkillVilla</h2>
							<p className="lead text-muted">
								SkillVilla is a modern professional media platform designed to empower freelancers, entrepreneurs, and organizations to connect, collaborate, and grow. Our platform offers a space where you can build your professional identity, showcase your skills, and find exciting opportunities.
							</p>
						</Col>
					</Row>

					<Row className="mt-5">
						<Col md={6} className="mb-4">
							<h4 className="fw-semibold">Our Mission</h4>
							<p>
								At SkillVilla, our mission is to help professionals unlock their potential and create meaningful connections in the workforce. We aim to build a community that fosters collaboration, creativity, and career growth. Whether you're a freelancer, a startup founder, or a business looking for talent, SkillVilla provides the tools and resources to succeed.
							</p>
						</Col>

						<Col md={6} className="mb-4">
							<h4 className="fw-semibold">Our Services</h4>
							<ul className="list-unstyled">
								<li>
									<strong>Explore Opportunities</strong> — Discover exciting job openings, freelance gigs, and collaboration opportunities in your field.
								</li>
								<li>
									<strong>Build Your Portfolio</strong> — Showcase your work, skills, and experiences through personalized profiles and portfolios.
								</li>
								<li>
									<strong>Networking and Communities</strong> — Join industry-specific communities, attend events, and connect with like-minded professionals.
								</li>
								<li>
									<strong>Workfolio</strong> — Create and manage a dynamic portfolio to present your skills, projects, and achievements to potential employers or collaborators.
								</li>
								<li>
									<strong>Post Stories and Updates</strong> — Share your professional journey, post updates, and engage with the community to showcase your expertise.
								</li>
								<li>
									<strong>Freelancer Support</strong> — Access resources and support for freelancers, including tools for managing projects, clients, and payments.
								</li>
							</ul>
						</Col>
					</Row>

					<Row className="mt-5 text-center">
						<Col>
							<h3 className="fw-semibold">Why Choose SkillVilla?</h3>
							<p className="text-muted">
								SkillVilla stands apart from traditional networking platforms by focusing on real connections and professional growth. We provide a tailored experience where each user has the opportunity to truly thrive in their field. Whether you're a job seeker, a freelancer, or a company looking for talent, SkillVilla helps you unlock your full potential.
							</p>
						</Col>
					</Row>
				</Container>
			</section>
		</>
  );
};

export default AboutPage;
