import React from 'react';
import { AppBar, Tabs, Tab, Button, CircularProgress, Typography } from '@material-ui/core';
import { FaCheckCircle } from "react-icons/fa";
import { TabPanel } from '../../../TabPanel';
import InterCity from '../../../../Business/book/InterCity';
import "./Intercity.css";
import Truck from '../../../../Business/book/Truck';
import ReactSession from 'react-client-session/dist/ReactSession';
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

export class Intercity extends React.Component {
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
    
        cli.on('connect', (data) => {
            cli.emit('join', "Hello from " + ReactSession.get('custID'));
        });
        cli.on('rideshare_' + ReactSession.get('custID'), (data1) => {
            let v = {...this.state};
            v.returnData = data1;
            this.setState(v);
        });
        ReactSession.setStoreType("localStorage");
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

    getBooking = async(bID) => {
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("../book/getIntercityBooking?bookingID=" + bID)
            .then((res) => {
                resolve(res.json());                
            });
        });
        return dat;
    }

    sendInfo = async() => {
        var ustte = {...this.state};
        ustte.startLooking = 1;
        this.setState(ustte);
        if(this.state.locationsCompleted > 0 && this.state.loadsCompleted > 0) {
            var loads = await this.registerLoads(this.state.loadsData);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingID: this.state.locationsData.time.key,
                    custID: await ReactSession.get("custID"),
                    loadID: loads['lID'],
                    payment: 0,
                    day: 0,
                    status: 0
                })
            };
            fetchAPI("../register/intercity", requestOptions)
            .then(async(res) => {
                var bo = {...await res.json()};
                var book = await this.getBooking(this.state.locationsData.time.key);
                var obj = {
                    bID: this.state.locationsData.time.key,
                    custID: await ReactSession.get("custID"),
                    truckID: this.state.locationsData.time.truckID,
                    loadID: loads['lID'],
                    pickup: book.pickup,
                    destination: book.destination,
                    date: book.date,
                    time: book.time,
                    rating: bo.iID,
                    paymentID: 0,
                    intercity: 0
                };
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj)
                };
                fetchAPI("../firebase/sendIntercityRequestToDriver", requestOptions);
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
        console.log(val);
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
        console.log(e.target.offsetParent.id.split('-')[2]);
        var tar = e.target;
        var val = parseInt(tar.offsetParent.id.split('-')[2]);
        var d = {...this.state};
        d.value = val;
        this.setState(d);
    }    

    signUpButton = () => {
        console.log(this.state.locationsCompleted, this.state.loadsCompleted);
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
                            <Tab label="Select Locations" {...this.a11yProps(0)}></Tab>
                            <Tab label="Select Loads" {...this.a11yProps(1)}></Tab>
                            <Tab label="Summary" {...this.a11yProps(2)}></Tab>
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                        <InterCity sendData={this.state.locationsData} 
                        setData={(v) => { this.setData('locationsData', v); console.log(v); }}/>
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
                            <h5>Pickup</h5>
                            {this.state.locationsData.pickup}
                            <br /><br />
                            <h5>Destination</h5>
                            {this.state.locationsData.destination}
                            <br /><br />
                            <h5>Time</h5>
                            {this.state.locationsData.time.label}
                            <br /><br />
                            <h5>Loads</h5>
                            {this.makeString(this.state.loadsData.loads)}
                            <br /><br />
                            <h5>Categories</h5>
                            {this.makeString(this.state.loadsData.categories)}
                        </div>
                        )}
                    </TabPanel>
                    <Button variant="contained" color="primary" onClick={this.changeTab}>Next</Button>&nbsp;
                    <Button variant="contained" color="primary" {...this.signUpButton()} onClick={this.sendInfo} >Book</Button>
                </div>
                )}
                {(this.state.startLooking === 1 && this.state.returnData === null) && (
                    <div>
                        <table>
                            <tr>
                                <td style={{padding: '20px'}}>
                                    <FaCheckCircle color='green' style={{margin: 'auto', width: '100px', height: '100px'}}/>
                                </td>
                                <td style={{padding: '20px'}}>
                                    <Typography style={{fontSize: '21px'}}>Your request has been sent to the driver. Check back after a while to know the status of the booking.</Typography>
                                </td>
                            </tr>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}

export default Intercity;