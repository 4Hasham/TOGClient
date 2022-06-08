import { React, Component } from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { requestJSONData } from './../../request/data';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/core/icon';
import './Truck.css';

export class Categories extends Component {
    
    constructor() {
        super();
        this.state = {
            prevProp: [],
            data: {
                categories: ['Nothing to show.']
            },
            form: {
                categories: []
            }
        };
    }

    async componentDidMount() {
        this.setState({
            data: {
                categories: await requestJSONData("shipments")
            }
        });
    }

    updateState = (e) => {
        console.log(this.state.data.categories);
        var t = e.target;
        if(t.value.trim().length === 0) {
            console.log("empty input");
        }
    }

    isValidCategory = (value) => {
        for(let i = 0; i < this.getCategories().length; ++i) {    
            if(this.getCategories()[i]['label'] === value) {
                console.log(this.getCategories()[i]['label']);
                return true;
            }
        }
        return false;
    }

    handleTag = ({ target }, fieldName) => {
        let cont = false;
        const { value } = target;
        cont = this.isValidCategory(value.trim());
        if(cont) {
            console.log(value);
            var dumb = {...this.state};
            if(dumb.form.categories.filter(({label}) => label === value).length === 0)
                dumb.form[fieldName].push({key: this.getCategories().find(({ label }) => label === value).key, label: value});
                //dumb.form[fieldName] = [...new Set(dumb.form[fieldName])];
            this.setState(dumb, () => {
                this.props.getCategories(this.state.form.categories);
                this.buttonAttr();
            });
        }
        console.log(this.state.form.categories);
    }

    getCategories = () => {
        var ob = this.state.data.categories;
        var arr = [];
        let id = 1;
        for(let i in ob) {
            if(ob[i] === undefined)
                break;
            arr.push({key: id, label: i});
            ++id;
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
                categories: val
            }
        }, () => {
            //this.props.getCategories(this.state.form.categories);
        });
    }

    handleDelete = (chipToDelete) => () => {
        var d = {...this.state};
        this.setState({
            form: {
                categories: d.form.categories.filter((el) => el.key !== chipToDelete.key)
            }
        }, () => {
            this.props.getCategories(this.state.form.categories);
        });
    };    

    compareTwo = (arr, arr1) => {
        if(arr.length !== arr1.length)
            return false;
        for(let i = 0; i < arr.length; ++i)
            if(arr[i] !== arr1[i])
                return false;
        return true;
    } 

    componentDidUpdate() {
        var dumb = {...this.state};
        if(!this.compareTwo(this.state.prevProp, this.props.setCategories)) {
            if(this.props.setCategories !== this.state.form.categories) {
                if(this.props.setCategories.length > 0) {
                    var ob = this.getCategories().find(({ label }) => label === this.props.setCategories[0]);
                    if(ob !== undefined) {
                        var ret = {key: ob.key, label: this.props.setCategories[0]};
                        console.log(ret);
                        dumb.form["categories"].push(ret);
                    }
                }
            }
            dumb.prevProp = [...this.props.setCategories];
            this.setState(dumb);
            this.props.getCategories(this.state.form.categories);
        }
    }

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
                {this.state.form.categories.map((data) => {
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
                    id="categories"
                    onSelect={(event) => this.handleTag(event, 'categories')}
                    options={this.getCategories()}
                    getOptionLabel={(option) => option.label.toString()}
                    getOptionSelected={(option, value) => option === value}
                    renderInput={
                        (params) => <TextField {...params} value={this.state.form.categories} onBlur={this.buttonAttr} name="categories" label="Enter Categories" />
                    }
                />
            </div>
        );
    }
};

export default Categories;