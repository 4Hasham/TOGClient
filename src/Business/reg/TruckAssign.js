import { React, Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getAddress, requestData } from './../../request/data';
import './TruckAssign.css';
import {fetchAPI} from '../../request/fetchAPI';

export class TruckAssign extends Component {
    constructor() {
        super();

        this.state = {
            form: {
                truck: '',
                route: '',
                routeID: 0,
                days: ''
            },
            data: {
                routes: ['Nothing to show'],
                dRoutes: []
            }
        };
    }

    sendInfo = async() => {
        console.log(this.state);
        var e = {...this.state.form};
//        e["admin"] = localStorage.getItem("admin");
        console.log(e);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(e)
        };
        fetchAPI("../register/truckAssign", requestOptions);
    }

    async componentDidMount() {
        this.setState({
            data: {
                routes: await requestData("routes")
            }
        });
        this.makeRoutes();
    }

    getRoutes = () => {
        return this.state.data.dRoutes;
    }

    makeRoutes = async() => {
        var routes = [];
        if(this.state.data.routes === undefined || !Array.isArray(this.state.data.routes))
            return ['Nothing to show'];
        for(let a = 0; a < this.state.data.routes.length; ++a) {
            let cur = this.state.data.routes[a];
            var pu = await getAddress(parseInt(cur['pickup']));
            var dest = await getAddress(parseInt(cur['destination']));
            routes.push({key: cur['ID'], label: (pu !== undefined ? pu["res"][2] : "") + " - " + (dest !== undefined ? dest["res"][2] : "") + " at " + cur['time'], days: cur['days']});
        }
        var o = {...this.state};
        o["data"]["dRoutes"] = routes;
        this.setState(o);
    }

    updateState = (e) => {
        //console.log("Inside");
        const {name, value} = e.target;
        var o = {...this.state};
        o["form"][name] = value;
        this.setState(o);
    }

    buttonAttr = () => {
        if(this.state.form.route.length === 0 || this.state.form.truck.trim().length === 0)
            return {
                disabled: true
            };
    }

    showInfo = () => {
        console.log("In show info")
        var arr = this.state.data.dRoutes;
        var days = "";
        for(let i = 0; i < arr.length; ++i) {
            if(arr[i]["label"] === this.state.form.route) {
                console.log(arr[i]);
                var daysA = JSON.parse(arr[i]["days"]);
                //console.log(daysA)
                for(let j = 0; j < daysA.length; ++j) {
                    days += daysA[j];
                    if(j !== daysA.length - 1)
                        days += ", ";
                }
                var o = {...this.state};
                o["form"]["days"] = days;
                this.setState(o, () => {
//                    console.log(this.state);
                });
                break;
            }
        }
    }

    handleTag = ({ target }, fieldName) => {
     //   console.log("Innnnnnnnn")
        const { value } = target;
        var o = {...this.state};
        o["form"][fieldName] = value;
        let curid = 0;
        for(let i = 0; i < this.state.data.dRoutes.length; ++i) {
            if(this.state.data.dRoutes[i]['label'] === value) {
                //console.log(value, this.state.data.dRoutes[i]['label']);
                //console.log(this.state.data.dRoutes[i]);
                curid = this.state.data.dRoutes[i]['key'];
                break;
            }
        }
        o["form"]["routeID"] = curid;
        console.log(o);
        this.setState(o, () => {
            this.showInfo();
            console.log(this.state);
        });        
    }

    render() {
        return(
            <div id="home-main">
            <h4>Assign Truck to Route</h4>
            <br />
            {(this.state.data.dRoutes !== null) &&
                <Autocomplete
                id="route"
                onSelect={(event) => this.handleTag(event, 'route')}
                options={this.getRoutes()}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => option === value}
                renderInput={
                    (params) => <TextField {...params} onBlur={this.buttonAttr} name="route" label="Route" onChange={this.updateState} />
                } 
                />
            }
                <br />
                {(this.state.form.days !== '') &&
                <p><b>Days: </b>{this.state.form.days}</p>
                }
                <br />
                <TextField name="truck" label="Truck" onChange={this.updateState} value={this.state.form.truck} />
                <br /><br />
                <Button {...this.buttonAttr()} onClick={this.sendInfo} variant="contained" color="primary">Assign</Button>
            </div>
        );
    }
};

export default TruckAssign;