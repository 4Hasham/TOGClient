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
        this.state = {
            nav: 0
        }
        ReactSession.setStoreType("localStorage");
    }

    componentDidMount = () => {
        window.addEventListener('scroll', this.setNavbar);
    }

    setNavbar = () => {
        var nav = 0;
        if(window.scrollY > window.screen.height) {
            nav = 1;
        }
        if(this.state.nav !== nav)
            this.setState({nav: nav});
    }

    render() {
        return(
        <Navbar scrolling dark expand="lg" fixed="top">
            {(this.state.nav === 0) && (
            <Container>
                <Navbar.Brand href="/">
                <img
                    alt=""
                    src="/logo_white.png"
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
                                <Nav.Link href="./signup" style={{color: '#FFF', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>Become a User</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            )}
            {(this.state.nav === 1) && (
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
                            <Nav.Link href="#home"><Link style={{color: '#333', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}} to="/">Home</Link></Nav.Link>
                            <Nav.Link href="#about" style={{color: '#333', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>About</Nav.Link>
                            <Nav.Link href="#offer" style={{color: '#333', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>Offer</Nav.Link>
                            <Nav.Link href="#download" style={{color: '#333', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>Download</Nav.Link>
                            {ReactSession.get("userID") === undefined && (
                                    <Nav.Link href="./signup" style={{color: '#333', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none'}}>Become a User</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>            
            )}
        </Navbar>
        );
    }
}

export default NavigationBar;