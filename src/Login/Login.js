import React from 'react';
import { AppBar, Tabs, Tab, Button } from '@material-ui/core';
import { TabPanel } from '../ui/TabPanel';
import Simple from '../ui/Simple';
import CustomerLogin from './CustomerLogin';
import DriverLogin from './DriverLogin';
import AdminLogin from './AdminLogin';
import ReactSession from 'react-client-session/dist/ReactSession';
import './Login.css';

export class Login extends React.Component {
    constructor() {
        super();
        ReactSession.setStoreType("localStorage");
        if(typeof ReactSession.get("userID") === 'number')
            window.location = './';
        this.state = {
            value: 0
        };
    }

    handleChange = (e) => {
        console.log(e.target.offsetParent.id.split('-')[2]);
        var tar = e.target;
        var val = parseInt(tar.offsetParent.id.split('-')[2]);
        this.setState({value: val});
    }    

    a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`
        };
    }

    render() {
        return(
            <div>
                <br />
                <div class="login-switch">
                    <Simple />
                    <br /><br />
                    <AppBar position='relative'>
                        <Tabs value={this.state.value} onChange={this.handleChange}>
                            <Tab label="Customer" {...this.a11yProps(0)}></Tab>
                            <Tab label="Driver" {...this.a11yProps(1)}></Tab>
                            <Tab label="Admin" {...this.a11yProps(2)}></Tab>
                        </Tabs>
                    </AppBar>
                </div>
                <div class="login-body">
                    <TabPanel value={this.state.value} index={0}>
                        <CustomerLogin />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        <DriverLogin />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                        <AdminLogin />
                    </TabPanel>
                    <br />
                    <p>Do not have an account? <a href="../signup">Signup</a>.</p>
                </div>
            </div>
        );
    }
};

export default Login;