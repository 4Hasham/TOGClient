import React from 'react';
import { Typography } from '@material-ui/core';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import './Footer.css';

export class Footer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div id="footer-main">
                <div id="footer-content">
                    <Container>
                        <Row>
                            <Col xs={6}>
                            <img 
                                alt=""
                                src="/logo.png"
                                width="120"
                                height="70"
                                className="d-inline-block align-top"
                            /><br /><br />
                            <span class="quote_inv_s">"</span>
                            <Typography id="info_txt">
                                TruckOnGo does not only care about business and firms, but we also keep in mind the day-to-day logistics and movements that an average household may need.
                            </Typography>
                            <span class="quote_inv_e">"</span>
                            </Col>
                            <Col>
                                <h4 className='heading'>Links</h4>
                                <Navbar>
                                    <Nav className='flex-column'>
                                        <Nav.Link>Home</Nav.Link>
                                        <Nav.Link>About</Nav.Link>
                                        <Nav.Link>Careers</Nav.Link>
                                        <Nav.Link>Offers</Nav.Link>
                                        <Nav.Link>Download</Nav.Link>

                                    </Nav>
                                </Navbar>
                            </Col>
                            <Col>
                                <Row>
                                    <Col><FaTwitter size={30} /></Col>
                                    <Col><FaFacebook size={30} /></Col>
                                    <Col><FaInstagram size={30} /></Col>
                                </Row>
                            </Col>
                        </Row>
                        <br /><br /><br />
                        <hr />
                        <br />
                        <Typography style={{width: '30vw', margin: 'auto', textAlign: 'center'}}>
                            Copyright &copy; {new Date().getFullYear()} TruckOnGo.<br />
                            All rights reserved.
                        </Typography>                
                    </Container>
                </div>
            </div>
        );
    }
};

export default Footer;