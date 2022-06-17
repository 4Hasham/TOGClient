import React from 'react';
import {Nav, Navbar, Container} from 'react-bootstrap'
import './NavigationBar.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ReactSession from 'react-client-session/dist/ReactSession';
import Slider from './Slider';
import Footer from './Footer';
  
export class NavigationBar extends React.Component {
    constructor() {
        super();
        ReactSession.setStoreType("localStorage");
    }

    render() {
        return(
        <>
        <Navbar scrolling dark expand="lg" fixed="top">
            <Container>
                <Navbar.Brand href="/">
                <img
                    alt=""
                    src="/logo.png"
                    width="87"
                    height="50"
                    className="d-inline-block align-top"
                />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="justify-content-end" style={{ width: "100%" }}>
                        <Nav.Link href="#home"><Link style={{color: '#FFF', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}} to="/">Home</Link></Nav.Link>
                        <Nav.Link href="#about" style={{color: '#FFF', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>About</Nav.Link>
                        <Nav.Link href="#offer" style={{color: '#FFF', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>Offer</Nav.Link>
                        <Nav.Link href="#download" style={{color: '#FFF', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>Download</Nav.Link>
                        {ReactSession.get("userID") === undefined && (
                            <div>
                                <Nav.Link href="./signup" style={{color: '#FFF', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>Become a User</Nav.Link>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
        );
    }
}

export default NavigationBar;