import { Component } from 'react';
import { Button, TextField, Select, OutlinedInput, InputLabel, Chip, Box, MenuItem, FormControl } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './IntercityRoute.css';
import * as cities from '../../utils/cities.json';
import {fetchAPI} from '../../request/fetchAPI';
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
            }
        };
    }

    sendInfo = () => {
        var e = {...this.state.form};
        e["admin"] = localStorage.getItem("admin");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(e)
        };
        fetchAPI("../register/route", requestOptions);
    }

    updateState = (e) => {
        const {name, value} = e.target;
        let o = {...this.state};
        o["form"][name] = value;
        this.setState(o, () => {
            this.buttonAttr();
            console.log(this.state);
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
                <h4>Add a New Intercity Route</h4>
                <br />
                <table>
                    <tbody>
                    <tr>
                        <td style={{padding: '15px'}}>
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
                        <td style={{padding: '15px'}}>
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
                        <td style={{padding: '15px'}} colSpan="2">
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
                        <td style={{padding: '15px'}} colSpan="2">
                            <Button {...this.buttonAttr()} variant="contained" onClick={this.sendInfo} color="primary">Add</Button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
};

export default IntercityRoute;