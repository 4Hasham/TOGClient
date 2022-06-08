import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Marker } from './Marker';

export class Map2 extends Component {

  constructor() {
    super();
    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      center: [],
      zoom: 18,
      draggable: true,
      cur: {
        lat: 0,
        lng: 0
      }
    }
  }

  componentWillMount() {
    setInterval(this.setCurrentLocation, 2000);
  }

  _onChange = ({center, zoom}) => {
    let d = {...this.state};
    d.center = center;
    d.zoom = zoom;
    this.setState(d);
  }

  _onClick = (value) => {
    let d = {...this.state};
    d.cur = {
      lat: value.lat,
      lng: value.lng
    };
    this.setState(d);
  }

  onMarkerInteraction = (childKey, childProps, mouse) => {
    let d = {...this.state};
    d.draggable = false;
    d.cur = {
      lat: mouse.lat,
      lng: mouse.lng
    }
    this.setState(d);
  }

  onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
      this.setState({ draggable: true }, () => {
        this._generateAddress();
      });
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

  _generateAddress = () => {
    const {
        mapApi
    } = this.state;
  }


  setCurrentLocation = () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            let d = {...this.state};
            d.cur = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            d.center = [position.coords.latitude, position.coords.longitude];
            this.setState(d);
        });
    }
  }

  render() {

    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: this.props.Mkey,
            libraries: this.props.libraries,
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
          //defaultCenter={this.props.center}
          defaultZoom={this.state.zoom}
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
            lat={this.state.cur.lat}
            lng={this.state.cur.lng}
            text="current" color="blue" draggable={false} />
          <Marker
            lat={this.props.dest.lat}
            lng={this.props.dest.lng}
            text="destination" color="red" draggable={false} />
          <Marker
            lat={this.props.pick.lat}
            lng={this.props.pick.lng}
            text="pickup" color="green" draggable={false} />
          <Marker
            lat={this.props.veh.lat}
            lng={this.props.veh.lng}
            text="vehicle" color="yellow" draggable={false} />

        </GoogleMapReact>
      </div>
    );
  }
}

export default Map2;