import React from 'react';
import { Container, Button } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import Map2 from '../../../../Business/loc/Map2';
import "./TrackRide.css";
import Geocode from 'react-geocode';
import ReactSession from 'react-client-session/dist/ReactSession';
import firebase from '../../../../firebase-config';
import io from 'socket.io-client';
import { fetchAPI } from '../../../../request/fetchAPI';

var cli = io('https://truckongo-apim.azure-api.net/', {
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
            console.log(errorObject.name);
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
                console.log(error);
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
        await fetchAPI("../firebase/cancelRideCustomer", requestOptions)
        .then((res) => {
            console.log(res.json());
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
            console.log(res.json());
            window.location = '/customer';
        });
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
            </div>
        );
    }
}

export default TrackRide;