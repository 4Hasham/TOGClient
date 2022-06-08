import React from 'react';
import Typography from '@material-ui/core/Typography';
import "react-alice-carousel/lib/alice-carousel.css";
import './FrontContent.css';
import { Image, Row, Col, Card } from 'react-bootstrap';
import { Button, Container } from 'react-bootstrap';
import ReactSession from 'react-client-session/dist/ReactSession';
import { FaCity, FaMap, FaTruckLoading, FaCheck, FaMoneyBill, FaSearchLocation } from "react-icons/fa";

export class FrontContent extends React.Component {
    constructor() {
        super();
        ReactSession.setStoreType("localStorage");
    }

    render() {
        return(
            <div>
            <Container>
                <div id="about">
                    <table style={{width: '100%'}}>
                        <tr>
                            <td style={{width: '30vw'}}>
                                <h1 style={{fontSize: '50px'}}>Book Your Luggage <span style={{color: 'midnightblue'}}>on the Go</span></h1>
                                <br />
                                <div>
                                    <Typography style={{fontSize: '20px'}}>
                                        We at TruckOnGo make sure the trucks are readily available, the prices are regularized and based on some metrics, also, we make sure the loaders that go about daily in search, get their customers as easily as possible.
                                    </Typography>
                                </div>       
                            </td>
                            <td style={{float: 'right'}}>
                                <Image src='../../intracity.png' />
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="offer">
                    <h2>What we <span style={{textDecoration: 'underline', textDecorationColor: 'midnightblue', textDecorationThickness: '6px'}}>Offer</span></h2>
                    <br /><br />
                    <Row>
                        <Col>
                            <Card className='card'>
                                <Card.Body>
                                        <Card.Title><FaMap style={{color: 'midnightblue', fontSize: '30px'}} /><br /><br />Intercity</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className='card'>
                                <Card.Body>
                                <Card.Title><FaCity style={{color: 'midnightblue', fontSize: '30px'}} /><br /><br />Intracity</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className='card'>
                                <Card.Body>
                                <Card.Title><FaSearchLocation style={{color: 'midnightblue', fontSize: '30px'}} /><br /><br />Live Tracking</Card.Title>
                                </Card.Body>  
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className='card'>
                                <Card.Body>
                                <Card.Title><FaTruckLoading style={{color: 'midnightblue', fontSize: '30px'}} /><br /><br />Dual Service</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className='card'>
                                <Card.Body>
                                <Card.Title><FaCheck style={{color: 'midnightblue', fontSize: '30px'}} /><br /><br />Trusted Drivers</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card className='card'>
                                <Card.Body>
                                <Card.Title><FaMoneyBill style={{color: 'midnightblue', fontSize: '30px'}} /><br /><br />Affordable Price</Card.Title>
                                </Card.Body>    
                             </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
            <br />
                <div id="download">
                    <table>
                        <tr>
                            <td style={{paddingLeft: '20vw', paddingRight: '20vw', paddingTop: '20vh', paddingBottom: '20vh'}}>
                                <h3 style={{color: 'white'}}>Download Now</h3>
                            </td>
                            <td>
                                <Button>
                                    <Image style={{width: '323px', height: '125px'}} src='../../google-play-badge.png' />
                                </Button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
};

export default FrontContent;