import React from 'react';
import { Typography } from '@material-ui/core';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import './FooterSimple.css';

export class FooterSimple extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            <Container className="simple-footer" style={{margin: 'auto', textAlign: 'center'}}>
                <hr />
                <Row style={{width: '20vw', margin: 'auto'}}>
                    <Col><FaTwitter size={20} /></Col>
                    <Col><FaFacebook size={20} /></Col>
                    <Col><FaInstagram size={20} /></Col>
                </Row>
                <br />
                <Typography style={{width: '30vw', margin: 'auto', textAlign: 'center'}}>
                    Copyright &copy; {new Date().getFullYear()} TruckOnGo.<br />
                    All rights reserved.
                </Typography>                
            </Container>
        );
    }
};

export default FooterSimple;