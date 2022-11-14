import React from 'react';
import { AppBar, Tabs, Tab, Button, CircularProgress } from '@material-ui/core';
import { TabPanel } from '../../../TabPanel';
import IntraCity from '../../../../Business/book/IntraCity';
import "./Intracity.css";
import Truck from '../../../../Business/book/Truck';
import Geocode from 'react-geocode';
import ReactSession from 'react-client-session/dist/ReactSession';
import io from 'socket.io-client';
import TrackRide from './TrackRide';
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

export class Intracity extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 0,
            locationsCompleted: 0,
            loadsCompleted: 0,
            locationsData: null,
            loadsData: null,
            returnData: null,
            startLooking: 0
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
        cli.on('rideshare_' + ReactSession.get('custID'), (data1) => {
            console.log(data1);
            let v = {...this.state};
            v.returnData = data1;
            this.setState(v);
        });
    }

    makeString = (arr) => {
        var s = "";
        for(let i = 0; i < arr.length; ++i)
            s += arr[i] + ", ";
        return s;
    }

    registerAddress = async(address) => {
        let str = address.split(", ");
        let ret = [];
        let offset = Math.floor((str.length - 2) / 3);
        let line1;
        let line2;
        let city;
        if(offset === 0 || offset < 0)
            offset = 1;
        let j = (str.length - 2 === 0) ? 1 : str.length - 2; 
        for(let i = 0; i < j; i += offset)
            ret.push(str[i]);
        
        if(ret.length >= 1) {
            if(ret[0] !== undefined)
                line1 = ret[0];
            else
                line1 = " ";
            if(ret[1] !== undefined)
                line2 = ret[1];
            else
                line2 = " ";
            if(ret[2] !== undefined)
                city = ret[2];
            else
                city = " ";
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                line1: line1,
                line2: line2,
                city: city
            })
        };
        return await new Promise((resolve, reject) => {
            fetchAPI("../register/address", requestOptions)
            .then((res) => {
                resolve(res.json());
            });
        });
    }

    registerLoads = async(data) => {
        let d = {
            load: this.makeString(data.loads),
            iID: 0,
            category: this.makeString(data.categories)
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(d)
        };
        return await new Promise((resolve, reject) => {
            fetchAPI("../register/load", requestOptions)
            .then((res) => {
                resolve(res.json());
            });
        })
    }

    sendInfo = async() => {
        var ustte = {...this.state};
        ustte.startLooking = 1;
        this.setState(ustte);
        if(this.state.locationsCompleted > 0 && this.state.loadsCompleted > 0) {
            var pickup = await this.registerAddress(this.state.locationsData.pickup);
            var destination = await this.registerAddress(this.state.locationsData.destination);
            var loads = await this.registerLoads(this.state.loadsData);
            var dat = new Date();
            let y = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(dat);
            let m = new Intl.DateTimeFormat('en', {month: 'numeric'}).format(dat);
            let d = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(dat);
            let h = new Intl.DateTimeFormat('en', {hour: 'numeric'}).format(dat).split(' ');
            let mi = new Intl.DateTimeFormat('en', {minute: 'numeric'}).format(dat);
            let s = new Intl.DateTimeFormat('en', {second: 'numeric'}).format(dat);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    custID: await ReactSession.get("custID"),
                    pickup: pickup['aID'],
                    destination: destination['aID'],
                    date: d + "/" + m + "/" + y,
                    time: `${h[0]}:${mi}:${s} ${h[1]}`,
                    loadID: loads['lID']
                })
            };
            fetchAPI("../book/intracity", requestOptions)
            .then(async(res) => {
                var bo = {... await res.json()};
                bo.pickup = pickup['aID'];
                bo.destination = destination['aID'];
                bo.loadID = loads['lID'];
                bo.custID = await ReactSession.get("custID");
                Geocode.fromAddress(this.state.locationsData.pickup)
                .then(
                    async(response) => {
                        const { lat, lng } = await response.results[0].geometry.location;
                        const requestOptions1 = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                booking: bo,
                                cust: {
                                    lat: lat,
                                    lng: lng
                                }
                            })
                        };
                        fetchAPI("../firebase/findDrivers", requestOptions1)
                        .then((res1) => {
                        });
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            });
        }
    }

    makeString = (arr) => {
        var s = "";
        for(let i = 0; i < arr.length; ++i)
            s += arr[i].label + ((arr.length - 1 !== i) ? ", " : "");
        return s;
    }

    setData = (target, val) => {
        var d = {...this.state};
        d[target] = val;
        if(target === 'locationsData')
            d['locationsCompleted'] = 1;
        else
            d['loadsCompleted'] = 1;
        this.setState(d);
    }

    changeTab = () => {
        var d = {...this.state};
        if(this.state.value === 0)
          d.value = 1;
        else if(this.state.value === 1)
          d.value = 2;
        else
            d.value = 0;
        this.setState(d);
    }    

    a11yProps = (index) => {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`
        };
    }

    handleChange = (e) => {
        var tar = e.target;
        var val = parseInt(tar.offsetParent.id.split('-')[2]);
        var d = {...this.state};
        d.value = val;
        this.setState(d);
    }    

    signUpButton = () => {
        if(this.state.locationsCompleted === 0 || this.state.loadsCompleted === 0)
          return {
            disabled: 'true'
          };
    }

    render() {
        return (
            <div>
                {this.state.startLooking === 0 && (
                <div>
                    <AppBar position='relative' color='transparent'>
                        <Tabs value={this.state.value} onChange={this.handleChange}>
                            <Tab label="Select Location" {...this.a11yProps(0)}></Tab>
                            <Tab label="Select Loads" {...this.a11yProps(1)}></Tab>
                            <Tab label="Summary" {...this.a11yProps(2)}></Tab>
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                        <IntraCity sendData={this.state.locationsData} 
                        setData={v => this.setData('locationsData', v)}/>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        <Truck sendData={this.state.loadsData}
                        setData={(v) => { this.setData('loadsData', v); }} />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                        {(this.state.loadsData !== null && this.state.locationsData !== null) && (
                        <div>
                            <h3>Summary</h3>
                            <br /><br />
                            <h6>Pickup</h6>
                            {this.state.locationsData.pickup}
                            <br /><br />
                            <h6>Destination</h6>
                            {this.state.locationsData.destination}
                            <br /><br />
                            <h6>Loads</h6>
                            {this.makeString(this.state.loadsData.loads)}
                            <br /><br />
                            <h6>Categories</h6>
                            {this.makeString(this.state.loadsData.categories)}
                            <br /><br />
                            <h6>Truck Type</h6>
                            {this.state.loadsData.truck}
                        </div>
                        )}
                    </TabPanel>
                    <Button variant="contained" color="primary" onClick={this.changeTab}>Next</Button>&nbsp;
                    <Button variant="contained" color="primary" {...this.signUpButton()} onClick={this.sendInfo} >Book</Button>
                </div>
                )}
                {(this.state.startLooking === 1 && this.state.returnData === null) && (
                    <div>
                        <CircularProgress />
                    </div>
                )}
                {this.state.returnData !== null && (
                    <TrackRide driverid={this.state.returnData.driver.account.ID} bookingid={this.state.returnData.truck.length} truckid={this.state.returnData.truck.tID} locs={this.state.locationsData} />
                )}
            </div>
        );
    }
}

export default Intracity;