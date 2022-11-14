import { Component } from 'react';
import { Button, TextField, Select, OutlinedInput, InputLabel, Chip, Box, MenuItem, FormControl, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './IntercityRoute.css';
import * as cities from '../../utils/cities.json';
import {fetchAPI} from '../../request/fetchAPI';
import { Alert } from 'react-bootstrap';
import { getAddress, getTruck, requestData } from '../../request/data';
var hours = [
    '00', '01' , '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
    '13' , '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
];
var mins = ['00', '15', '30', '45'];
var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export class IntercityRoute extends Component {
    constructor() {
        super();
        this.state = {
            form: {
                pickup: '',
                destination: '',
                days: [],
                timeH: '',
                timeM: ''
            },
            data: {
                routes: [],
                temp: [],
                dRoutes: []
            }
        };
    }

    async componentDidMount() {
        this.setState({
            data: {
                routes: await requestData("routes")
            }
        });
        this.makeRoutes();
    }

    sendInfo = async() => {
        var e = {...this.state.form};
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(e)
        };
        var s = await fetchAPI("../register/route", requestOptions);
        var formn = {
            pickup: '',
            destination: '',
            days: [],
            timeH: '',
            timeM: ''
        };
        var f = {...this.state};
        f.form = formn;
        this.setState(f);
        var ss = s.json();
        if(ss)
            document.getElementById("success-msg").style.display = 'block';
    }

    showInfo = () => {
        var arr = [...this.state.data.temp];
        for(let i = 0; i < arr.length; ++i) {
            arr[i].days = arr[i].days.replace(/[\[\]"]+/g, "");
        }
        var d = {...this.state};
        d.data.dRoutes = [...arr];
        this.setState(d);
    }

    makeRoutes = async() => {
        var routes = [];
        if(this.state.data.routes === undefined || !Array.isArray(this.state.data.routes))
            return ['Nothing to show'];
        for(let a = 0; a < this.state.data.routes.length; ++a) {
            let cur = this.state.data.routes[a];
            var pu = await getAddress(parseInt(cur['pickup']));
            var dest = await getAddress(parseInt(cur['destination']));
            var trck = {};
            if(cur['truckID'] !== 0)
                trck = await getTruck(parseInt(cur['truckID']));
            else
                trck = {
                    ttype: 'Nil',
                    numberPlate: "Nil",
                };
            routes.push({key: cur['ID'], label: (pu !== undefined ? pu["res"][2] : "") + " to " + (dest !== undefined ? dest["res"][2] : ""), truck: trck.ttype + " - " + trck.numberPlate, time: cur['time'], days: cur['days']});
        }
        var o = {...this.state};
        o["data"]["temp"] = routes;
        this.setState(o, () => { this.showInfo(); });
    }

    updateState = (e) => {
        const {name, value} = e.target;
        let o = {...this.state};
        o["form"][name] = value;
        this.setState(o, () => {
            this.buttonAttr();
        });
    }

    buttonAttr = () => {
        if(this.state.form.pickup.trim().length === 0 || this.state.form.destination.trim().length === 0 || this.state.form.timeH.trim().length === 0 || this.state.form.timeM.trim().length === 0 || this.state.form.days.length === 0)
            return {
                disabled: true
            };
    }

    handleTag = ({ target }, fieldName) => {
        let cont = false;
        const { value } = target;
        if(fieldName === "pickup" || fieldName === "destination") {
            cont = cities.default.cities.includes(value.trim());
        }
        else if(fieldName === "timeH") {
            cont = hours.includes(value.trim());
        }
        else if(fieldName === "timeM") {
            cont = mins.includes(value.trim());
        }
        if(cont) {
            let o = {...this.state};
            o["form"][fieldName] = value;
            this.setState(o, () => {
                this.buttonAttr();
            });
        }
    }

    render() {
        return(
            <div id="home-main">
                <h3>Intercity Routes</h3>
                <br />
                <Alert id="success-msg" variant='success'>
                    <Alert.Heading>
                        Success
                    </Alert.Heading>
                    <p>Registered.</p>
                </Alert>
                <br />
                <table>
                    <tbody>
                    <tr>
                        <th>
                            Add Route
                        </th>
                        <th style={{paddingLeft: '40px'}}>
                            Existing Routes
                        </th>
                    </tr>
                    <tr>
                        <td style={{width: '30%'}}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{paddingBottom: '15px', paddingTop: '15px'}}>
                                            <Autocomplete
                                            id="pickup"
                                            onSelect={(event) => this.handleTag(event, 'pickup')}
                                            options={cities.default.cities}
                                            getOptionSelected={(option, value) => option === value}
                                            renderInput={
                                                (params) => <TextField {...params} onBlur={this.buttonAttr} name="pickup" label="Pickup" onChange={this.updateState} />
                                            } 
                                            />
                                        </td>
                                        <td style={{padding: '15px'}}>
                                            <Autocomplete
                                            id="destination"
                                            onSelect={(event) => this.handleTag(event, 'destination')}
                                            options={cities.default.cities}
                                            getOptionSelected={(option, value) => option === value}
                                            renderInput={
                                                (params) => <TextField {...params} onBlur={this.buttonAttr} name="destination" label="Destination" onChange={this.updateState} />
                                            }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom: '15px', paddingTop: '15px'}}>
                                            <Autocomplete
                                            id="timeH"
                                            onSelect={(event) => this.handleTag(event, 'timeH')}
                                            options={hours}
                                            getOptionSelected={(option, value) => option === value}
                                            renderInput={
                                                (params) => <TextField {...params} onBlur={this.buttonAttr} name="timeH" label="Hours" onChange={this.updateState} />
                                            }
                                            />
                                        </td>
                                        <td style={{padding: '15px'}}>
                                            <Autocomplete
                                            id="timeM"
                                            onSelect={(event) => this.handleTag(event, 'timeM')}
                                            options={mins}
                                            getOptionSelected={(option, value) => option === value}
                                            renderInput={
                                                (params) => <TextField {...params} onBlur={this.buttonAttr} name="timeM" label="Minutes" onChange={this.updateState} />
                                            }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom: '15px', paddingTop: '15px'}} colSpan="2">
                                            <FormControl style={{ m: 1, width: 300 }}>
                                                <InputLabel id="days-label">Active Days</InputLabel>
                                                <Select multiple={true}
                                                labelId="days-label"
                                                id="days"
                                                name="days"
                                                value={this.state.form.days}
                                                onChange={this.updateState}
                                                input={<OutlinedInput id="days" name="days" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}>
                                                    {days.map((day) => (
                                                        <MenuItem key={day} value={day}>
                                                        {day}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <Button {...this.buttonAttr()} variant="contained" onClick={this.sendInfo} color="primary">Add Route</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td style={{paddingLeft: '40px'}} colSpan="2">
                            {typeof this.state.data.dRoutes !== 'undefined' && (
                            <table id="routes-table" className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Route</th>
                                        <th scope="col">Truck</th>
                                        <th scope="col">Days</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                {this.state.data.dRoutes.length > 0 && (this.state.data.dRoutes?.map((val, ind) => {
                                    return(
                                        <tr>
                                            <td>{ind + 1}</td>
                                            <td>
                                                {val.label}
                                            </td>
                                            <td>
                                                {val.truck}
                                            </td>
                                            <td>
                                                {val.days}
                                            </td>
                                            <td>
                                                {val.time}
                                            </td>
                                            <td>
                                                <Button color='error' variant='filled'>Delete</Button>
                                            </td>
                                        </tr>
                                    );
                                }))}
                            </table>
                            )}
                            {typeof this.state.data.dRoutes === 'undefined' && (
                                <CircularProgress />
                            )}
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
};

export default IntercityRoute;