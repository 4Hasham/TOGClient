import { React, Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { requestJSONData } from './../../request/data';
import './TruckReg.css';
import { isAlphaNumeric, isNumeric } from '../../utils/Validation';
import { fetchAPI } from '../../request/fetchAPI';
import ReactSession from 'react-client-session/dist/ReactSession';
import { Alert } from 'react-bootstrap';

export class TruckReg extends Component {
    constructor() {
        super();
        ReactSession.setStoreType("localStorage");
        this.state = {
            form: {
                numberPlate: '',
                truckType: '',
                model: '',
                capacity: '',
                length: ''
            },
            data: {
                trucks: ['Nothing to show']
            }
        };
    }

    sendInfo = async() => {
        let d = {...this.state.form}
        d['driverID'] = ReactSession.get('drivID');
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(d)
        };
        var s = await fetchAPI("register/truck", requestOptions);
        var formn = {
            numberPlate: '',
            truckType: '',
            model: '',
            capacity: '',
            length: ''
        }
        var f = {...this.state};
        f.form = formn;
        this.setState(f);
        var ss = s.json();
        if(ss)
            document.getElementById("success-msg").style.display = 'block';

    }

    async componentDidMount() {
        this.setState({
            data: {
                trucks: await requestJSONData("trucks")
            }
        });
    }

    updateState = (e) => {
        var t = e.target;
        if(t.value.trim().length === 0) {
            var dumb = {...this.state};
            dumb.form[t.name] = '';
            this.setState(dumb, () => {
                this.buttonAttr();
            });
        }
        if(this.validateForm(t)) {
            var dumb1 = {...this.state};
            dumb1.form[t.name] = t.value;
            this.setState(dumb1, () => {
            });
        }
    }

    isValidTruck = (value) => {
        for(let i = 0; i < this.state.data.trucks.length; ++i)
            if(this.state.data.trucks[i]['name'] === value)
                return true;
        return false;
    }

    handleTag = ({ target }, fieldName) => {
        let cont = false;
        const { value } = target;
        cont = this.isValidTruck(value.trim());
        if(cont) {
            var dumb = {...this.state};
            dumb.form[fieldName] = value;
            this.setState(dumb, async() => {
                await this.setTextFields();
                this.buttonAttr();
            });
        }
    }

    getTrucks = () => {
        return this.state.data.trucks;
    }

    isEmptyState = () => {
        for(let c in this.state.form) {
            if(this.state.form[c].trim() === '') {
                return true;
            }
        }
        return false;
    }

    buttonAttr = () => {
        if(this.isEmptyState() === true) {
            return {disabled: true};
        }
    }

    setTextFields = () => {
        for(let i = 0; i < this.state.data.trucks.length; ++i) {
            if(this.state.data.trucks[i]['name'] === this.state.form.truckType) {
                var dumb = {...this.state};
                dumb.form['capacity'] = this.state.data.trucks[i]['capacity']; 
                this.setState(dumb);
            }
        }
    }

    validateForm = (target) => {
        if(target.name === "capacity" || target.name === "length")
            return isNumeric(target.value);
        else if(target.name === "model" || target.name === "numberPlate")
            return isAlphaNumeric(target.value);
        else
            return true;
    }

    render() {
        return (
            <div id="home-main">
                <h3>Register New Truck</h3><br />
                <Alert id="success-msg" variant='success'>
                    <Alert.Heading>
                        Success
                    </Alert.Heading>
                    <p>Registered.</p>
                </Alert>
                <br />
                <TextField name="numberPlate" value={this.state.form.numberPlate} onBlur={this.buttonAttr} onChange={this.updateState} label="Number Plate" /><br/><br />
                <TextField name="model" value={this.state.form.model} onBlur={this.buttonAttr} onChange={this.updateState} label="Truck Model"/><br /><br />
                <Autocomplete 
                    id="truckType"
                    style={{width: '40vw'}}
                    onSelect={(event) => this.handleTag(event, 'truckType')}
                    options={this.getTrucks()}
                    getOptionLabel={(option) => option.name.toString()}
                    getOptionSelected={(option, value) => option === value}
                    renderInput={
                        (params) => <TextField {...params} onBlur={this.buttonAttr} name="truckType" label="Truck Type/Company/Name" onChange={this.updateState} />
                    }
                />
                <br />
                <TextField name="capacity" value={this.state.form.capacity} onBlur={this.buttonAttr} onChange={this.updateState} label="Capacity in kilograms (kg)" /><br /><br />
                <TextField name="length" value={this.state.form['length']} onBlur={this.buttonAttr} onChange={this.updateState} label="Length of container in feet" />
                <br /><br />
                <Button {...this.buttonAttr()} variant="contained" onClick={this.sendInfo} color="primary">Register</Button>
            </div>
        );
    }
};

export default TruckReg;