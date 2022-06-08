import { React, Component } from 'react';
//import GoogleMapReact from 'google-map-react';
//import { TextField } from '@material-ui/core';
import './Address.css';
export class Address extends Component {
    constructor(props) {
        super(props);
        this.clearSearchBox = this.clearSearchBox.bind(this);
        this.focusout = this.focusout.bind(this);

    }

    componentDidMount({ map, mapApi, address } = this.props) {
        const options = {
            // restrict your search to a specific type of result
            types: ['address'],
            // restrict your search to a specific country, or an array of countries
            componentRestrictions: { country: ['pk'] },
        };
        this.autoComplete = new mapApi.places.Autocomplete(
            this.searchInput,
            options,
        );
        this.autoComplete.addListener('place_changed', this.onPlaceChanged);
        this.autoComplete.bindTo('bounds', map);
        this.searchInput.value = address;
    }

    componentWillUnmount({ mapApi } = this.props) {
        mapApi.event.clearInstanceListeners(this.searchInput);
    }

    onPlaceChanged = ({ map, addplace, address } = this.props) => {
        const place = this.autoComplete.getPlace();

        if (!place.geometry) return;
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        addplace(place);
       // this.searchInput.value = address;
    };

    clearSearchBox = () => {
        this.props.bar(this.props.identity);
    }

    focusout = () => {
        console.log("Empty " + this.props.identity);
        if(this.searchInput.value.trim().length === 0)
            this.props.isempty(this.props.identity);
    }
    render() {
        return (
            <input
                className="search-input"
                ref={(ref) => {
                    this.searchInput = ref;
                }}
                type="text"
                onFocus={this.clearSearchBox}
                onKeyUp={this.focusout}
                placeholder="Enter a location"
            />
        );
    }
}

export default Address;