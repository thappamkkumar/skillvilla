import { useNavigate } from 'react-router-dom'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
//import CountUp from '../../Common/CountUp';
 



const HeroSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/sign-up");
  };

  return (
    <section className="py-5 py-md-3 px-2 px-md-3 px-lg-4 px-xl-5 heroSection">
      <Row className="align-items-center w-100 p-0 pb-3 pb-md-5 mx-auto">
        <Col md={6}>
          <div className="mb-4" style={{ maxWidth: '600px', height: 'auto' }}>
						<div  >
							<h1 className="display-5 mb-4 fw-bold">Connect, Share, Grow</h1>
							<p className="mb-4 fs-5 text-secondary">
								Join a vibrant community of professionals where collaboration meets opportunity. Whether you're showcasing your experience, finding freelance gigs, sharing knowledge, or connecting with like-minded creators - our platform empowers you to grow faster, work smarter, and build meaningful networks. Discover jobs, contribute to projects, and be part of a thriving ecosystem of innovation.
							</p>

							<Button
								variant="dark"
								size="lg"
								className="fw-bold px-4 py-2"
								title="Get Started"
								id="getStartNowBTN"
								onClick={handleClick}
							>
								Get Started
							</Button>
						</div>
						 {/* Selected Stats */}
						 
						 {/*<Row className="mt-4 w-100    text-center">
								<Col xs={6} md={4} >
									<h3 className="fw-bold mb-0">
										<CountUp end={10000} duration={2} separator="," />+
									</h3>
									<small className="text-muted">Active Users</small>
								</Col>
								<Col xs={6} md={4} >
									<h3 className="fw-bold mb-0">
										<CountUp end={300} duration={2} />+
									</h3>
									<small className="text-muted">Communities</small>
								</Col>
								<Col xs={6} md={4}  className="mt-3 mt-md-0">
									<h3 className="fw-bold mb-0">
										<CountUp end={4000} duration={2} separator="," />+
									</h3>
									<small className="text-muted">Projects</small>
								</Col>
								 
							</Row>
							
						 */}

						
						
						
          </div>
        </Col>
        <Col md={6} className="text-center">
          <Image
            src="images/hero2.png"
            alt="App Preview"
            fluid
            className="rounded-3"
          />
        </Col>
      </Row>

       
    </section>
  );
};

export default HeroSection;
