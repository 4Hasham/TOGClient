import { React, Component } from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { requestJSONData } from './../../request/data';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/core/icon';
import './Truck.css';

export class Load extends Component {
    
    constructor() {
        super();
        this.state = {
            data: {
                load: ['Nothing to show.']
            },
            form: {
                load: []
            }
        };
    }

    async componentDidMount() {
        this.setState({
            data: {
                load: await requestJSONData("shipments")
            }
        });
    }

    updateState = (e) => {
        console.log(this.state.data.load);
        var t = e.target;
        if(t.value.trim().length === 0) {
            console.log("empty input");
        }
    }

    isValidLoad = (value) => {
        for(let i = 0; i < this.getLoads().length; ++i) {    
            if(this.getLoads()[i]['label'] === value) {
                console.log(this.getLoads()[i]['label']);
                return true;
            }
        }
        return false;
    }

    handleTag = ({ target }, fieldName) => {
        let cont = false;
        const { value } = target;
        cont = this.isValidLoad(value.trim());
        if(cont) {
            console.log(value);
            var dumb = {...this.state};
            if(dumb.form.load.filter(({label}) => label === value).length === 0)
                dumb.form[fieldName].push({key: this.getLoads().find(({ label }) => label === value).key, label: value});
            this.setState(dumb, () => {
                this.props.getLoad(this.state.form.load);
                this.buttonAttr();
            });
        }
        console.log(this.state.form.load);
    }

    getLoads = () => {
        var ob = this.state.data.load;
        var arr = [];
        let id = 1;
        for(let i in ob) {
            if(ob[i]['keywords'] === undefined)
                break;
            for(let j = 0; j < ob[i]['keywords'].length; ++j) {
                arr.push({key: id, label: ob[i]['keywords'][j]})
                ++id;
            }
        }
        return arr;
    }

    isEmptyState = () => {
        for(let c in this.state.form) {
            if(typeof this.state.form[c] === 'string' || this.state.form[c] instanceof String)
                if(this.state.form[c].trim() === '')
                    return true;
        }
        return false;
    }

    buttonAttr = () => {
        if(this.isEmptyState() === true) {
            return {disabled: true};
        }
    }

    setChipData = (val) => {
        this.setState({
            form: {
                load: val
            }
        }, () => {
            //this.props.getLoad(this.state.form.load);
            console.log("From laod: fired")
        });
    }

    handleDelete = (chipToDelete) => () => {
        var d = {...this.state};
        this.setState({
            form: {
                load: d.form.load.filter((el) => el.key !== chipToDelete.key)
            }
        }, () => {
            this.props.getLoad(this.state.form.load);
        });
    };    

    render() {
        const flexContainer = {
            display: 'flex',
            flexDirection: 'row',
            padding: 0,
        };
        return (
            <div>
            <Paper
            style={flexContainer}
            component="ul">
                {this.state.form.load.map((data) => {
                    let icon;
                    if (data.label === 'React') {
                        icon = <TagFacesIcon />;
                    }
                    return (
                        <ListItem key={data.key}>
                            <Chip
                            icon={icon}
                            label={data.label}
                            onDelete={data.label === 'React' ? undefined : this.handleDelete(data)}
                            />
                        </ListItem>
                    );
                })}
            </Paper>
            <br />
            <Autocomplete
                    id="load"
                    onSelect={(event) => this.handleTag(event, 'load')}
                    options={this.getLoads()}
                    getOptionLabel={(option) => option.label.toString()}
                    getOptionSelected={(option, value) => value.label.toString() === option.label.toString()}
                    renderInput={
                        (params) => <TextField {...params} onBlur={this.buttonAttr} name="load" label="Enter Loads" />
                    }
                />
            </div>
        );
    }
};

export default Load;