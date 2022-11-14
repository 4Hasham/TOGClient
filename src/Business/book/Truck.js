import { React, Component } from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { requestJSONData } from './../../request/data';
import { Load } from './Load';
import { Categories } from './Categories';
import './Truck.css';

export class Truck extends Component {    
    constructor() {
        super();
        this.state = {
            form: {
                loads: [],
                categories: [],
                truck: ''
            },
            data: {
                mapC: [],
                rawCat: null,
                mapL: [],
                trucks: ['Nothing to show']
            },
        };
    }

    componentWillMount() {
        //in case there are previous values coming from parent    
        let prevData = this.props.sendData;
        let d = {...this.state};
        for(let a in prevData)
            d['form'][a] = prevData[a];
        this.setState(prevData);
    }

    checkOnlyUnempty = () => {
        let total = Object.keys(this.state.form).length;
        let field_arr = [];
        for(let s in this.state.form) {
            if(typeof this.state.form[s] === 'string' || this.state.form[s] instanceof String) {
                if(this.state.form[s] !== '')
                    field_arr.push(s);
            }
            else {
                if(this.state.form[s].length > 0) {
                    field_arr.push(s);
                }
            }
        }
        if(field_arr.length === total)
          return true;
        else
          return false;
    }

    async componentDidMount() {
        var dum = {...this.state};
        dum.data.trucks = await requestJSONData("truck_types");
        dum.data.mapC = await requestJSONData("map");
        dum.data.rawCat = await requestJSONData("shipments");

        if(this.state.data.rawCat !== null) {
            for(let i in this.state.data.rawCat) {
                this.state.data.mapL.push(JSON.stringify(this.state.data.rawCat[i]["keywords"]));
            }
        }
        this.setState(dum);
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
        var dumb1 = {...this.state};
        dumb1.form[t.name] = t.value;
        this.setState(dumb1, () => {
            if(this.checkOnlyUnempty()) {
                this.props.setData(this.state.form);
            }    
        });
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
                this.buttonAttr();
                if(this.checkOnlyUnempty()) {
                    this.props.setData(this.state.form);
                }
            });
        }
    }

    copyLoad = (arr) => {
        var dumb = {...this.state};
        dumb.form['loads'] = [...arr];
        this.setState(dumb, async() => {
            this.suggestCategories(this.state.form.loads, this.state.form.categories);
            this.buttonAttr();
            if(this.checkOnlyUnempty()) {
                this.props.setData(this.state.form);
            }
        });       
    }

    copyCategories = (arr) => {
        var dumb = {...this.state};
        dumb.form['categories'] = [...arr];
        dumb.form['categories'] = [...new Set(dumb.form['categories'])];
        this.setState(dumb, async() => {
            this.buttonAttr();
            if(this.checkOnlyUnempty()) {
                await this.suggestVehicles(this.state.form.categories, this.state.form.truck);
                this.props.setData(this.state.form);
            }
        });
    }

    getTrucks = () => {
        return this.state.data.trucks;
    }

    isEmptyState = () => {
        for(let c in this.state.form) {
            if(typeof this.state.form[c] === 'string' || this.state.form[c] instanceof String)
                if(this.state.form[c].trim() === '')
                    return true;
        }
        if(this.state.form['loads'].length !== 0)
            return false;
        else
            return true;
    }
    
    buttonAttr = () => {
        if(this.isEmptyState() === true) {
            return {disabled: true};
        }
    }

    makeArray(s) {
        return s.split(", ");
    }

    makeString(s) {
        var s = "";
        for(let i = 0; i < s.length; ++i)
            s = s.concat(s[i] + ((i < s.length - 1) ? ", " : ""));
        return s;
    }

    suggestCategories = (s, cur) => {
        var curValues = [...cur];
        var sl = [...s];
        var suggestions = [];

        for(let i = 0; i < this.state.data.mapL.length; ++i) {
            var pool = [];
            var jsonObject = JSON.parse(this.state.data.mapL[i]);
            for(let j = 0; j < jsonObject.length; ++j){
                pool.push(jsonObject[j]);
            }
            for(let k = 0; k < sl.length; ++k) {
                if(sl[k] !== undefined) {
                    if(pool.indexOf(sl[k].label) >= 0) {
                        if(Object.keys(this.state.data.rawCat)[i] !== undefined) {
                            if(!suggestions.includes(Object.keys(this.state.data.rawCat)[i])) {
                                suggestions.push(Object.keys(this.state.data.rawCat)[i]);
                            }    
                        }
                    }    
                }
            }
        }
        
        for(let i = 0; i < suggestions.length; ++i)
            if(curValues.indexOf(suggestions[i]) >= 0)
                suggestions.splice(i, 1);

        let d = {...this.state};
        d.form.categories = [...suggestions];
        this.setState(d);
    }

    suggestVehicles = async(s, cur) => {
        var curValues = this.makeArray(cur);
        var suggestions = [];

        for (let i = 0; i < this.state.data.mapC.length; ++i) {
            for (let j = 0; j < s.length; ++j) {
                var sug = this.state.data.trucks[this.state.data.mapC[this.state.data.categories.indexOf(s[j])]];
                var sugo = JSON.parse(sug);
                var sugg = sugo["name"];
                if(suggestions.indexOf(sugg) < 0)
                    suggestions.add(sugg);
            }
        }
        
        for(let i = 0; i < suggestions.length; ++i)
            if(curValues.indexOf(suggestions[i]) >= 0)
                suggestions.remove(suggestions[i]);

        let d = {...this.state};
        d.form.truck = suggestions[0];
        this.setState(d);
    }

    render() {
        return (
            <div id="main">
                <Load getLoad={(val) => this.copyLoad(val)} setLoad={this.state.form.loads} />
                <br />
                <Categories getCategories={(val) => this.copyCategories(val)} setCategories={this.state.form.categories} />
                <br />
                <Autocomplete
                    id="truck"
                    onSelect={(event) => this.handleTag(event, 'truck')}
                    options={this.getTrucks()}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) => option === value}
                    renderInput={
                        (params) => <TextField {...params} onBlur={this.buttonAttr} name="truck" label="Truck" onChange={this.updateState} />
                    }
                />
                <br />
            </div>
        );
    }
};

export default Truck;