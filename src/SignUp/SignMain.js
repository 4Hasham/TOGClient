import React from 'react';
import { AppBar, Tabs, Tab, Button } from '@material-ui/core';
import { TabPanel } from '../ui/TabPanel';
import Simple from '../ui/Simple';
import SignUp from '../SignUp/SignUp';
import './SignMain.css';

export class SignMain extends React.Component {
    constructor() {
        super();
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
                <div className="signup-switch">
                    <Simple />
                    <br /><br />
                    <AppBar position='relative'>
                        <Tabs value={this.state.value} onChange={this.handleChange}>
                            <Tab label="Customer" {...this.a11yProps(0)}></Tab>
                            <Tab label="Driver" {...this.a11yProps(1)}></Tab>
                        </Tabs>
                    </AppBar>
                </div>
                <div className="signup-body">
                    <TabPanel value={this.state.value} index={0}>
                        <SignUp user="customer" />
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        <SignUp user="driver" />
                    </TabPanel>
                </div>
            </div>
        );
    }
};

export default SignMain;