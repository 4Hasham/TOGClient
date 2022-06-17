import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { Image } from 'react-bootstrap';
import "./DriverInfo.css";
import { fetchAPI } from '../../../request/fetchAPI';

export class DriverInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            driverData: null
        }
    }

    componentDidMount = async() => {
        await this.loadData();
    }
    loadData = async() => {
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("admin/getDriverInfo?id=" + this.props.driverID)
            .then((res) => {
                resolve(res.json());                
            });
        });
        let d = {...this.state};
        d.driverData = dat;
        console.log(d);
        this.setState(d);
    }

    setStatus = async(status) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: this.state.driverData.driverID,
                status: status
            })
        };    
        var dat = await new Promise((resolve, reject) => {
            fetchAPI("admin/setDriverStatus", requestOptions)
            .then((res) => {
                resolve(res.json());                
            });
        });
    }

    render() {
        return (
            <div id="home-main">
                {this.state.driverData !== null && (
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Image src={`https://truckongo.azurewebsites.net/uploads/${this.state.driverData.cnic_front}`} style={{width: '300px', height: '150px'}} />
                            </td>
                            <td>
                                <Image src={`https://truckongo.azurewebsites.net/uploads/${this.state.driverData.cnic_back}`} style={{width: '300px', height: '150px'}} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Image src={`https://truckongo.azurewebsites.net/uploads/${this.state.driverData.license_front}`} style={{width: '300px', height: '150px'}} />
                            </td>
                            <td>
                                <Image src={`https://truckongo.azurewebsites.net/uploads/${this.state.driverData.license_back}`} style={{width: '300px', height: '150px'}} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <Button variant='contained' onClick={() =>  { this.setStatus(1) }} color='primary'>Accept</Button>
                                <Button variant='contained' onClick={() => { this.setStatus(-1) }} color='warning'>Reject</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                )}
                {this.state.driverData === null && (
                    <CircularProgress />
                )}       
            </div>
        );
    }
}

export default DriverInfo;