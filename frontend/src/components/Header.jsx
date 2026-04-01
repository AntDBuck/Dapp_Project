import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';
import Identicon from 'identicon.js';
import { formatAddress } from "./UtilTools";

function Header({ account })
{
  return (
    <Navbar bg='dark' data-bs-theme='dark' expand='lg' className='header'>
      <Container fluid>
        <Navbar.Brand>📰 News Maker Dapp</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className='mx-auto gap-1 ps-5'>
            <Nav.Link as={NavLink} to='/'>Home</Nav.Link>
            <Nav.Link as={NavLink} to='/all-articles'>All Articles</Nav.Link>
            <Nav.Link as={NavLink} to='/create-article'>Create Article</Nav.Link>
            <Nav.Link as={NavLink} to='/test'>Test</Nav.Link>
          </Nav>
          <div className='d-flex align-items-center ms-auto gap-3'>
            {
              account &&
              <>
                <Navbar.Text>{formatAddress(account)}</Navbar.Text>
                <img 
                  src={`data:image/png;base64,${new Identicon(account, 30).toString()}`} className='rounded-circle'
                />
              </>
            }
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
