import { React, Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './InterCity.css';
import * as cities from '../../utils/cities.json';
import { getIntercity } from '../../request/data';


export class InterCity extends Component {
    
    constructor() {
        super();
        this.state = {
            form: {
                pickup: '',
                destination: '',
                time: null    
            },
            data: {
                timings: []
            }
        };
    }

    componentWillMount() {
        //in case there are previous values coming from parent    
        let prevData = this.props.sendData;
        let d = {...this.state};
        for(let a in prevData)
            d['form'][a] = prevData[a];
    }

    updateState = async(e) => {
        const {name, value} = e.target;
        let prev = this.state.form[name];
        let cont = false;
        if(value.trim().length === 0) {
            let d = {...this.state};
            d.form[name] = '';
            this.setState(d, () => {
                this.buttonAttr();
            });
            return;
        }
        if(name === "pickup" || name === "destination") {
            cont = cities.default.cities.includes(value.trim());    
        }
        else if(name === "time") {
            cont = this.state.data.timings.includes(value.trim());
            console.log("69");
            console.log(this.state.form.time, value);
        }
        if(cont === true) {
            let d = {...this.state};
            d.form[name] = value;
            this.setState(d, () => {
                this.buttonAttr();
            });
        }
        else {
            let d = {...this.state};
            d.form[name] = prev;
            this.setState(d, () => {
                this.buttonAttr();
            });
        }
        return;
    }

    buttonAttr = () => {
 
        if(this.state.form.pickup.trim().length === 0 || this.state.form.destination.trim().length === 0 || this.state.form.time !== null)
            return {
                disabled: true
            };
        else{}
    }

    handleTag = ({ target }, fieldName) => {
        let cont = false;
        const { value } = target;
        console.log(value);
        if(fieldName === "pickup" || fieldName === "destination") {
            cont = cities.default.cities.includes(value.trim());
        }
        if(cont || fieldName === "time") {
            var v = {...this.state};
            if(fieldName === "time") {
                for(let i = 0; i < this.state.data.timings.length; i++) {
                    let m = this.state.data.timings[i];
                    if(m.label === value)
                        v.form.time = m;
                }
            }
            else
                v.form[fieldName] = value;
            this.setState(v, async() => {
                this.buttonAttr();
                var d = {...this.state};
                if(this.state.form.pickup.trim() !== '' && this.state.form.destination.trim() !== '') {
                    var tim = await getIntercity(this.state.form.pickup.trim(), this.state.form.destination.trim());
                    if(tim.length > 0) {
                        d.data.timings = [];
                        for(let i = 0; i < tim.length; ++i) {
                            d.data.timings.push({
                                label: tim[i]["date"] + ", " + tim[i]["time"],
                                truckID: tim[i]["truckID"],
                                key: tim[i]['bID']
                            });
                        }
                        this.props.setData(this.state.form);
                    }
                    else {
                        d.data.timings = [];
                    }
                }
                else {
                    d.data.timings = [];
                }
                this.setState(d, () => {
                    console.log(d, () => {
                        this.buttonAttr();
                    });
                });
            });
        }
    }

    // setTime = (e, obj) => {
    //     const {name} = e.target;
    //     var d = {...this.state};
    //     d.form.time = obj;
    //     console.log("In, I am.");
    //     this.setState(d, () => console.log(this.state));        
    // }

    render() {
        return(
            <div id="main">
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
                    <td colSpan="2" style={{padding: '15px'}}>
                        <Autocomplete
                        id="time"
                        onSelect={(event) => this.handleTag(event, 'time')}
                        options={this.state.data.timings}
                        getOptionLabel={(option) => option.label}
                        getOptionSelected={(option, value) => option === value}
                        renderInput={
                            (params) => <TextField {...params} onBlur={this.buttonAttr} name="time" label="Available Rounds" />
                        }
                        />
                    </td>
                </tr>
                {/* <tr>
                    <td style={{padding: '15px'}} colSpan="2">
                        <Button {...this.buttonAttr()} variant="contained" color="primary">Next</Button>
                    </td>
                </tr> */}
                </tbody>
                </table>
            </div>
        );
    }
};

export default InterCity;