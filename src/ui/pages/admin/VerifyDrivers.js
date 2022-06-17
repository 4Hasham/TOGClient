import { Divider, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import React from 'react';
import { fetchAPI } from '../../../request/fetchAPI';
import "./VerifyDrivers.css";
import DriverInfo from './DriverInfo';

export class VerifyDrivers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drivers: [],
            showID: 0
        }
    }

    componentDidMount = async() => {
        await this.loadDrivers();
    }

    loadDrivers = async() => {
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("admin/getPendingDrivers")
            .then((res) => {
                resolve(res.json());                
            });
        });
        let d = {...this.state};
        d.drivers = dat;
        this.setState(d);
    }

    showData = (id) => {
        var d = {...this.state};
        d.showID = id;
        this.setState(d);
    }

    render() {
        return (
            <div id="home-main">
                {this.state.showID === 0 && (
                    <List id="dsa" sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {this.state.drivers?.map((value, ind) => {
                        return(
                            <div>
                                <table>
                                    <tr>
                                        <td>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                            primary={value.first_name + " " + value.last_name}
                                            secondary={
                                                <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {value.phone}
                                                </Typography><br />
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {value.destination}
                                                </Typography><br />
                                                {value.gender + " | " + value.dob}
                                                </React.Fragment>
                                            }
                                            />
                                        </ListItem>
                                        </td>
                                        <td>
                                            <Button onClick={(e) => {this.showData(value.ID)}}>
                                        &gt;
                                        </Button>
                                        </td>
                                    </tr>
                                </table>
                                <Divider variant="inset" component="li" />
                            </div>     
                        )})}
                    </List>
                )}
                {this.state.showID > 0 && (
                    <DriverInfo driverID={this.state.showID} />
                )}
            </div>
        );
    }
}

export default VerifyDrivers;