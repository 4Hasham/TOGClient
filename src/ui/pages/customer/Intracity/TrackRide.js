import React from 'react';
import { Container, Button, Input, CircularProgress } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import Map2 from '../../../../Business/loc/Map2';
import { FaPaperPlane, FaCircle, FaAngleUp, FaAngleDown } from "react-icons/fa";
import "./TrackRide.css";
import Geocode from 'react-geocode';
import ReactSession from 'react-client-session/dist/ReactSession';
import firebase from '../../../../firebase-config';
import io from 'socket.io-client';
import { fetchAPI } from '../../../../request/fetchAPI';

var cli = io('http://localhost:5000/', {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttemps: 10,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false
});

export class TrackRide extends React.Component {
    constructor() {
        super();
        this.state = {
            mapApiLoaded: false,
            mapApi: null,
            mapInstance: null,
            set: true,
            place: '',
            returnData: null,
            rating: 0,
            msgs: [],
            opened: -1,
            pick: {
                lat: 0,
                lng: 0
            },
            dest: {
                lat: 0,
                lng: 0
            },
            cur: {
                lat: 0,
                lng: 0
            },
            veh: {
                lat: 0,
                lng: 0
            }
        }
        
        Geocode.setApiKey("AIzaSyAGz6Z8U8Y7jlT9abxQzDDlIHscbNn1cjI");
        Geocode.setLanguage("en");
        Geocode.setRegion("pk");
        Geocode.setLocationType("ROOFTOP");
        Geocode.enableDebug();
        ReactSession.setStoreType("localStorage");

        cli.on('connect', (data) => {
            cli.emit('join', "Hello from " + ReactSession.get('custID'));
        });
        cli.on('ratingshare_' + ReactSession.get('custID'), (data1) => {
            let v = {...this.state};
            v.returnData = data1;
            this.setState(v);
        });
    }

    updateDriver = () => {
        const db = firebase.ref('trucks/' + this.props.truckid);
        db.on('value', async(snapshot) => {
            let dataa = snapshot.val();
            this.state.veh.lat = dataa.lat;
            this.state.veh.lng = dataa.lng;
        }, (errorObject) => {
        });
    }

    loadLocs = async() => {
        var d = {...this.state};
        await Geocode.fromAddress(this.props.locs.pickup)
        .then(
            async(response) => {
                const { lat, lng } = await response.results[0].geometry.location;
                d.pick.lat = lat;
                d.pick.lng = lng;
            },
            (error) => {
            }
        );
        await Geocode.fromAddress(this.props.locs.destination)
        .then(
            async(response) => {
                const { lat, lng } = await response.results[0].geometry.location;
                d.dest.lat = lat;
                d.dest.lng = lng;
            },
            (error) => {
                console.log(error);
            }
        );
        return d;
    }
    
    componentDidMount = async() => {
        var st = await this.loadLocs();
        this.setState(st);
        setInterval(this.updateDriver, 2000);
        setInterval(this.loadMsgs, 3000);
    }

    setMapApi = (m) => {
        this.setState({
            mapApi: m
        });
    }

    setMapInstance = (m) => {
        this.setState({
            mapInstance: m
        });
    }

    setApi = (b, m, ms) => {
        let d = {...this.state};
        d.mapApiLoaded = b;
        d.mapInstance = m;
        d.mapApi = ms;
        this.setState(d);
    }

    cancelRide = async() => {
        var booking = this.props.bookingid;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({bookingID: booking})
        };
        await fetchAPI("firebase/cancelRideCustomer", requestOptions)
        .then((res) => {
            window.location = '/customer';
        });
    }

    setValue = (val) => {
        var o = {...this.state};
        o["rating"] = val;
        this.setState(o);
    }

    rate = async() => {
        var booking = this.props.bookingid;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({bID: booking, rating: this.state.rating})
        };
        await fetchAPI("../book/completeRating", requestOptions)
        .then((res) => {
            window.location = '/customer';
        });
    }

    loadMsgs = async() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id1: ReactSession.get('userID'), id2: this.props.driverid})
        };
        await fetchAPI("../chat/getMsgs", requestOptions)
        .then(async(res) => {
            var f = await res.json();
            var d = {...this.state};
            d.msgs = [...f];
            this.setState(d);
        });
        document.getElementById("box").scrollTo(0, document.getElementById("box").scrollHeight);
    }

    sendMsg = async(msg) => {
        document.getElementById('msg').value = '';
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: msg,
                sender: ReactSession.get('userID'),
                receiver: this.props.driverid
            })
        };
        await fetchAPI("../chat/send", requestOptions)
        .then((res) => {
            this.loadMsgs();
        });
    }

    openChat = () => {
        var el = document.getElementById('chat-body');
        if(this.state.opened === -1) {
            el.style.display = 'block';
        }
        else {
            el.style.display = 'none';
        }
        var d = {...this.state};
        d.opened = d.opened * -1;
        this.setState(d);
    }

    render() {
        const { mapApiLoaded, mapInstance, mapApi } = this.state;
        return(
            <div>
                {this.state.returnData == null && (
                    <table style={{ height: '100vh', width: '100%' }}>
                        <tr>
                            <td style={{ height: '100vh', width: '60%' }}>
                                <Map2
                                    Mkey="AIzaSyAGz6Z8U8Y7jlT9abxQzDDlIHscbNn1cjI"
                                    libraries={['places', 'geometry']}
                                    MapApi={this.setMapApi}
                                    MapInstance={this.setMapInstance}
                                    setApi={this.setApi}
                                    pick={this.state.pick}
                                    dest={this.state.dest}
                                    veh={this.state.veh}
                                />
                            </td>
                            <td style={{height: '100vh'}}>
                                <Container>
                                {mapApiLoaded && (
                                    <div>
                                        <br />
                                        <h5>Pickup Location</h5>
                                        <br />
                                        {this.props.locs.pickup}
                                        <br /><br />
                                        <h5>Destination Location</h5>
                                        <br />
                                        {this.props.locs.destination}                                    
                                        <br /><br />
                                        <Button onClick={this.cancelRide}>Cancel Ride</Button>
                                    </div>
                                )}
                                </Container>
                            </td>
                        </tr>
                    </table>
                )}
                {this.state.returnData !== null && (
                    <div>
                        <h3>Rate this ride.</h3>
                        <br />
                        <Rating name="half-rating" value={this.state.rating} onChange={(event, newValue) => { this.setValue(newValue); }} defaultValue={2.5} precision={0.5} />
                        <br />
                        <Button onClick={this.rate}>Rate</Button>
                    </div>
                )}
                <div id="chatbox">
                    <div id="bar" onClick={this.openChat}>
                        {this.state.opened === -1 && (
                            <FaAngleUp style={{width: '36px', height: '36px'}} color='white' />
                        )}
                        {this.state.opened === 1 && (
                            <FaAngleDown style={{width: '36px', height: '36px'}} color='white' />
                        )}
                        Chat
                        <span>
                            <FaCircle style={{width: '16px', height: '16px', color: 'green'}} />
                        </span>
                    </div>
                    <div id="chat-body">
                        <div id="box">
                        {this.state.msgs.length > 0 && (
                        <div>
                        {this.state.msgs?.map((ind, value) => {
                            return (
                                <div>
                                    {this.state.msgs[value].sender == ReactSession.get('userID') && (
                                        <div style={{display: 'block', borderRadius: '10px', float: 'right', background: '#90ee90', color: '#FFFFFF', padding: '8px'}}>
                                            {this.state.msgs[value].message}
                                        </div>
                                    )}
                                    {this.state.msgs[value].receiver == ReactSession.get('userID') && (
                                        <div style={{display: 'block', borderRadius: '10px', float: 'left', background: '#0096FF', color: '#FFFFFF', padding: '8px'}}>
                                            {this.state.msgs[value].message}
                                        </div>
                                    )}
                                    <br /><br />
                                </div>
                            );
                            })}
                        </div>                                
                        )}

                        {this.state.msgs.length === 0 && (
                            <CircularProgress />
                        )}
                        </div>
                        <div id="dash">
                            <Input style={{width: 325}} variant='outlined' id='msg' />
                            <Button onClick={() => { this.sendMsg(document.getElementById('msg').value); }}>
                                <FaPaperPlane style={{width: '24px', height: '24px', color: 'midnightblue'}} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TrackRide;