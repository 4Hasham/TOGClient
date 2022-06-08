import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Marker } from './Marker';

export class Map extends Component {

  constructor() {
    super();
    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: [],
      center: [],
      zoom: 11,
      lat: null,
      lng: null,
      draggable: true,
      address: null,
    }
  }

  componentWillMount() {
    this.setCurrentLocation();
  }

  setPickup(e) {
    this.setState({
      order: {
        set: this.state.order.set,
        pickup: e,
        destination: this.state.order.destination
      }
    });
  }

  setDestination(e) {
    this.setState({
      order: {
        set: this.state.order.set,
        pickup: this.state.order.pickup,
        destination: e
      }
    });
  }

  _onChange = ({center, zoom}) => {
    this.setState({
        center: center,
        zoom: zoom,
    });
  }

  _onClick = (value) => {
    this.setState({
        lat: value.lat,
        lng: value.lng
    });
  }

  addPlace = () => {
    this.setState({
        places: [this.props.place],
        lat: this.props.place.geometry.location.lat(),
        lng: this.props.place.geometry.location.lng()
    }, () => {
      this._generateAddress();  
    });
  };

  onMarkerInteraction = (childKey, childProps, mouse) => {
    this.setState({
        draggable: false,
        lat: mouse.lat,
        lng: mouse.lng
    });
  }

  onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
      this.setState({ draggable: true }, () => {
        this._generateAddress();
      });
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                center: [position.coords.latitude, position.coords.longitude],
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
    }
  }

  // _onDrag(map) {
  //   console.log(map);
  // }

  apiHasLoaded = (map, maps) => {
      this.setState({
          mapApiLoaded: true,
          mapInstance: map,
          mapApi: maps,
      }, () => {
        this._generateAddress();
        this.props.setApi(true, map, maps);
      });
  };

  _generateAddress() {
    const {
        mapApi
    } = this.state;

    const geocoder = new mapApi.Geocoder();

    geocoder.geocode({ 'location': { lat: this.state.lat, lng: this.state.lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
            this.zoom = 12;
            this.setState({ address: results[0].formatted_address }, () => {
              this.props.address(this.state.address);
            });
        } else {
            window.alert('No results found');
        }
      } else {
          window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  render() {

    return (
      <div style={{ height: '45vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: this.props.Mkey,
            libraries: this.props.libraries,
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
          // defaultCenter={this.props.center}
          // defaultZoom={this.props.zoom}
          zoom={this.state.zoom}
          center={this.state.center}
          draggable={this.state.draggable}
          onChange={this._onChange}
          onClick={this._onClick}
          onChildMouseDown={this.onMarkerInteraction}
          onChildMouseUp={this.onMarkerInteractionMouseUp}
          onChildMouseMove={this.onMarkerInteraction}
          onDrag={this._onDrag}>
          <Marker
            lat={this.state.lat}
            lng={this.state.lng}
            text="My Marker" color="blue" />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;