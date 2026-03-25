import React from 'react';
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Identicon from 'identicon.js';
import 'bootstrap/dist/css/bootstrap.min.css';

  // <nav className="navbar navbar-expand-lg navbar-dark bg-transparent ">
  //     <div className="container">
  //       <Link className="navbar-brand" to="/"><b>Our Decentralized Storage (ODS)</b></Link>

  //       <div className="ms-auto d-flex align-items-center text-light" >

  //         <Link to='/uploadfiles' className="btn btn-outline-light mr-2">
  //           <i className="bi bi-plus-circle-dotted" ></i>
  //         </Link>
  //           {account &&
  //         <Link to="/"  >
  //             <img
  //               className='ml-2'
  //               width='30'
  //               style={{ borderRadius: 20 }}
  //               height='30'
  //               alt="logo"
  //               src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
  //             />
  //         </Link>
  //           }
  //       </div>
  //     </div>
  //   </nav>


function Header({ account })
{
  return (
    <header>
      <Navbar bg='light'>
        <Container fluid>
          <Navbar.Brand>📰 News Maker Dapp</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav.Link as={NavLink} to='/'>Home</Nav.Link>
            <Nav.Link as={NavLink} to='/about'>About</Nav.Link>
            <Nav.Link as={NavLink} to='/all-articles'>All Articles</Nav.Link>
            <Nav.Link as={NavLink} to='/my-articles'>My Articles</Nav.Link>
            <img>src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}</img>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
