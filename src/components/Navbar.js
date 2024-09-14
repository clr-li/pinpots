// Filename - Navbar.js
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function MainNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">PinPots</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/explore.html">Explore</Nav.Link>
            <Nav.Link href="/search.html">Search</Nav.Link>
            <Nav.Link href="/mymap.html">MyMap</Nav.Link>
            <Nav.Link href="/post.html">Post</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/login.html">Login</Nav.Link>
            <Nav.Link
              href="/signup.html"
              style={{
                backgroundColor: 'grey',
                borderRadius: '5px',
                color: 'white',
              }}
            >
              Signup
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
