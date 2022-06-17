import React from 'react';
import { AppBar, Tabs, Tab, Typography, Button, CircularProgress } from '@material-ui/core';
import { List, ListItem, Divider, ListItemText } from '@material-ui/core';
import { TabPanel } from '../../TabPanel';
import "./History.css";
import ReactSession from 'react-client-session/dist/ReactSession';
import { getAddress } from '../../../request/data';
import { TrackRide } from './Intracity/TrackRide';
import { fetchAPI } from '../../../request/fetchAPI';
export class History extends React.Component {
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
        await this.loadActive();
        await this.loadPrev()
    }

    loadActive = async() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                custID: ReactSession.get("custID")
            })
        };    
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("../book/getActiveCustomerRides", requestOptions)
            .then((res) => {
                resolve(res.json());                
            });
        });
        let d = {...this.state};
        for(let i = 0; i < dat.length; ++i) {
            dat[i].pickup = await this.getAddressFromID(dat[i].pickup);
            dat[i].destination = await this.getAddressFromID(dat[i].destination);
        }
        d.active = dat;
        this.setState(d);
    }

    loadPrev = async() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                custID: ReactSession.get("custID")
            })
        };
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("../book/getPrevCustomerRides", requestOptions)
            .then((res) => {
                resolve(res.json());                
            });
        });
        let d = {...this.state};
        for(let i = 0; i < dat.length; ++i) {
            dat[i].pickup = await this.getAddressFromID(dat[i].pickup);
            dat[i].destination = await this.getAddressFromID(dat[i].destination);
        }
        d.prev = dat;
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

    getAddressFromID = async(aid) => {
        if(aid === 0)
            return;
        let d = await getAddress(aid);
        let s = d.res[0] + " " + d.res[1] + " " + d.res[2];
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
                                                        {"Pending" + " | " + "Rs. 0"}
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
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
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

export default History;