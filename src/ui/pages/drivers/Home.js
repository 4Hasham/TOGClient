import React from 'react';
import "./Home.css";
import PropTypes from "prop-types";
import { FaCheckCircle, FaCross, FaInfoCircle } from "react-icons/fa";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter
} from "react-router-dom";
import ReactSession from 'react-client-session/dist/ReactSession';
import { Typography } from '@material-ui/core';
import { fetchAPI } from '../../../request/fetchAPI';

export class Home extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            n: "",
            info: "",
            status: 0,
            loaded: false
        }
        ReactSession.setStoreType("localStorage");
    }

    componentDidMount = async() => {
        await this.loadData();
    }

    loadData = async() => {
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("admin/getDriverInfo?id=" + ReactSession.get('drivID'))
            .then((res) => {
                resolve(res.json());                
            });
        });
        let d = {...this.state};
        if(dat.hasOwnProperty('err')) {
            d.status = -2;

        }
        else {
            d.status = dat.status;
        }
        d.loaded = true;
        this.setState(d);
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };
    
    render() {
        const { match, location, history } = this.props;
        return (
            <Router>
                {this.state.loaded === true && (
                <div id="home-main">
                    {this.state.status === 1 && (
                    <table>
                        <tr>
                            <td style={{padding: '20px'}}>
                                <FaCheckCircle color='green' style={{margin: 'auto', width: '100px', height: '100px'}}/>
                            </td>
                            <td style={{padding: '20px'}}>
                                <Typography style={{fontSize: '21px'}}>You are verified.</Typography>
                            </td>
                        </tr>
                    </table>
                    )}
                    {this.state.status === -1 && (
                    <table>
                        <tr>
                            <td style={{padding: '20px'}}>
                                <FaCross color='red' style={{margin: 'auto', width: '100px', height: '100px'}}/>
                            </td>
                            <td style={{padding: '20px'}}>
                                <Typography style={{fontSize: '21px'}}>You did not meet our verification criteria.</Typography>
                            </td>
                        </tr>
                    </table>
                    )}
                    {this.state.status === 0 && (
                    <table>
                        <tr>
                            <td style={{padding: '20px'}}>
                                <FaInfoCircle color='gold' style={{margin: 'auto', width: '100px', height: '100px'}}/>
                            </td>
                            <td style={{padding: '20px'}}>
                                <Typography style={{fontSize: '21px'}}>You verification request is under review, please check back.</Typography>
                            </td>
                        </tr>
                    </table>
                    )}
                    {this.state.status === -2 && (
                    <table>
                        <tr>
                            <td style={{padding: '20px'}}>
                                <FaInfoCircle color='gold' style={{margin: 'auto', width: '100px', height: '100px'}}/>
                            </td>
                            <td style={{padding: '20px'}}>
                                <Typography style={{fontSize: '21px'}}>Please submit the form in verification tab.</Typography>
                            </td>
                        </tr>
                    </table>
                    )}
                </div>
                )}
            </Router>
        );
    }
}

const HomeR = withRouter(Home);
export default HomeR;