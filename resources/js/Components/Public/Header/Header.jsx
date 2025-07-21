import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { BsX, BsList } from 'react-icons/bs';
import { HashLink } from 'react-router-hash-link';

const Header = () => {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/#contact', label: 'Contact' },
    { to: '/about', label: 'About' },
    { to: '/login', label: 'Login' },
  ];

  return (
    <header className="py-2 px-2 px-md-3 px-lg-4 px-xl-5 border-bottom overflow-hidden">
      <Container fluid>
        <Row className="align-items-center text-center text-md-start w-100 p-0 m-0">
          {/* Logo */}
          <Col xs={12} md={6} className="mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start p-0 ">
            <div className="logo  ">
              <span className="logo-s">S</span>
              <span className="char">k</span>
              <span className="char">i</span>
              <span className="char">l</span>
              <span className="char">l</span>
              <span className="logo-villa">v</span>
              <span className="logo-villa">i</span>
              <span className="logo-villa">l</span>
              <span className="logo-villa">l</span>
              <span className="logo-villa">a</span>
            </div>
          </Col>

          {/* Nav */}
          <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end p-0">
            <Navbar   className="header_nav_bar p-0  overflow-auto ">
              <Nav className="gap-2 ">
                 
                  <Nav.Item  >
                    <Nav.Link
                      as={NavLink}
                      to='/'
                      className="  header_navigation_link px-2 py-1"
                      title={`Go to ${'Home'.toLowerCase()} page`}
                    >
                      Home
                    </Nav.Link>
                  </Nav.Item>
                 
								  <Nav.Item  >
                    <Nav.Link
                      as={HashLink} smooth
                      to='/#contact'
                      className="  header_navigation_link px-2 py-1"
                      title={`Go to ${'Contact'.toLowerCase()} page`}
                    >
                      Contact
                    </Nav.Link>
                  </Nav.Item>
									
									 <Nav.Item  >
                    <Nav.Link
                      as={NavLink}
                      to='/about'
                      className="  header_navigation_link px-2 py-1"
                      title={`Go to ${'About'.toLowerCase()} page`}
                    >
                      About
                    </Nav.Link>
                  </Nav.Item>
									
									<Nav.Item  >
                    <Nav.Link
                      as={NavLink}
                      to='/login'
                      className="  header_navigation_link px-2 py-1"
                      title={`Go to ${'Login'.toLowerCase()} page`}
                    >
                     Login
                    </Nav.Link>
                  </Nav.Item>
									
              </Nav>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
