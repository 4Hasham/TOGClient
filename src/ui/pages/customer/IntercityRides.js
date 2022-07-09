import React from 'react';
import { AppBar, Tabs, Tab, Typography, Button, CircularProgress } from '@material-ui/core';
import { List, ListItem, Divider, ListItemText } from '@material-ui/core';
import { TabPanel } from '../../TabPanel';
import "./History.css";
import ReactSession from 'react-client-session/dist/ReactSession';
import { getAddress } from '../../../request/data';
import { TrackRide } from './Intracity/TrackRide';
import { fetchAPI } from '../../../request/fetchAPI';
export class IntercityRides extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 0,
            active: [],
            prev: [],
            track: null,
            trackBool: false
        }
        ReactSession.setStoreType("localStorage");
    }

    componentDidMount = async() => {
        let custID = ReactSession.get("custID");
        await this.loadActive(custID);
        await this.loadPrev(custID)
    }

    loadActive = async(custID) => {    
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("../book/getActiveIntercityRides?custID=" + custID)
            .then((res) => {
                resolve(res.json());                
            });
        });
        let d = {...this.state};
        console.log(dat);
        for(let i = 0; i < dat.length; ++i) {
            if(dat[i] !== undefined && dat[i] !== null) {
                var b = await this.getBooking(dat[i].bookingID);
                dat[i].pickup = b.pickup;
                dat[i].destination = b.destination;    
                dat[i].date = b.date;
                dat[i].time = b.time;
            }
        }
        d.active = dat;
        console.log(d);
        this.setState(d);
    }

    loadPrev = async(custID) => {
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("../book/getPrevIntercityRides?custID=" + custID)
            .then((res) => {
                resolve(res.json());                
            });
        });
        let d = {...this.state};
        for(let i = 0; i < dat.length; ++i) {
            if(dat[i] !== undefined) {
                var b = await this.getBooking(dat[i].bookingID);
                dat[i].pickup = b.pickup;
                dat[i].destination = b.destination;    
                dat[i].date = b.date;
                dat[i].time = b.time;
            }
        }
        d.prev = dat;
        console.log(d);
        this.setState(d);
    }

    makeString = (arr) => {
        var s = "";
        for(let i = 0; i < arr.length; ++i)
            s += arr[i] + ", ";
        return s;
    }

    // changeTab = () => {
    //     var d = {...this.state};
    //     if(this.state.value === 0)
    //       d.value = 1;
    //     else if(this.state.value === 1)
    //       d.value = 2;
    //     else
    //         d.value = 0;
    //     this.setState(d);
    // }    

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

    getBooking = async(bID) => {
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("../book/getIntercityBooking?bookingID=" + bID)
            .then((res) => {
                resolve(res.json());                
            });
        });
        dat.pickup = await this.getAddressFromID(dat.pickup);
        dat.destination = await this.getAddressFromID(dat.destination);
        return dat;
    }

    getAddressFromID = async(aid) => {
        if(aid === 0)
            return;
        let d = await getAddress(aid);
        console.table(d);
        var s = "";
        if(d !== undefined)
            s = d.res[2];
        return s; 
    }

    getPayment = async(pid) => {
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("../api/getPaymentA?pid=" + pid)
            .then((res) => {
                resolve(res.json());                
            });
        });
        return dat.fare;
    }

    showTracker = (bookingid, truckid, locationsData) => {
        var ob = {
            bookingid: bookingid,
            tID: truckid,
            locationsData: locationsData 
        };
        var d = {...this.state};
        d.trackBool = true;
        d.track = ob;
        this.setState(d);
    }

    getStatus = (val) => {
        if(val == -1)
        return "Rejected";
        else if(val == 0)
            return "Pending";
        else if(val == 1)
            return "Accepted";
        else if(val == 2)
            return "Loaded";
        else if(val == 3)
            return "On the way to destination";
        else if(val == 4)
            return "Delivered and checked out";
        else 
            return "Collected and paid.";    
    }

    render() {

        return (
            <div>
            {(this.state.track === null) && (
                <div id="home-main">
                    <AppBar position='relative' color='transparent'>
                        <Tabs value={this.state.value} onChange={this.handleChange}>
                            <Tab label="Active Rides" {...this.a11yProps(0)}></Tab>
                            <Tab label="Previous Rides" {...this.a11yProps(1)}></Tab>
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                        {(this.state.active.length > 0) && (
                        <List id="dsa" sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {this.state.active?.map((value, ind) => {
                                return(
                                    <div>
                                        <table>
                                            <tr>
                                                <td>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemText
                                                    primary={value.date + " " + value.time}
                                                    secondary={
                                                        <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {value.pickup}
                                                        </Typography><br />
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {value.destination}
                                                        </Typography><br />
                                                        {this.getStatus(value.status)} | Rs. 0
                                                        </React.Fragment>
                                                    }
                                                    />
                                                </ListItem>
                                                </td>
                                                <td>
                                                    <Button onClick={(e) => {this.showTracker(value.bID, value.truckID, {pickup: value.pickup, destination: value.destination})}}>
                                                &gt;
                                                </Button>
                                                </td>
                                            </tr>
                                        </table>
                                        <Divider variant="inset" component="li" />
                                    </div>     
                                )
                            })}
                        </List>
                        )}
                        {this.state.active.length === 0 && (
                            <CircularProgress />
                        )}
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        {this.state.prev.length > 0 && (
                        <List id="asd" sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {this.state.prev?.map((value, ind) => {
                                return(
                                    <div>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                            primary={value.date + " " + value.time}
                                            secondary={
                                                <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {value.pickup}
                                                </Typography><br />
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {value.destination}
                                                </Typography><br />
                                                Completed
                                                </React.Fragment>
                                            }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </div>     
                                )
                            })}
                        </List>
                        )}
                        {this.state.prev.length === 0 && (
                            <CircularProgress />
                        )}
                    </TabPanel>
                </div>
            )};
            {(this.state.track !== null) && (
                <TrackRide bookingid={this.state.track.bookingid} truckid={this.state.track.tID} locs={this.state.track.locationsData} />
            )}
            </div>
        );
    }
}

export default IntercityRides;