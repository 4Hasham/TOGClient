import React, { Component } from 'react';
import { Container, Button } from '@material-ui/core';
import { Map } from '../loc/Map';
import { Address } from '../loc/Address';

export class IntraCity extends Component {

    constructor() {
        super();

        this.state = {
            mapApiLoaded: false,
            mapApi: null,
            mapInstance: null,
            set: true,
            place: '',
            form: {
                pickup: ' ',
                destination: ''
            }
        }

        this.handleButton = this.handleButton.bind(this);
    }

    setMapApi = (m) => {
        this.setState({
            mapApi: m
        });
    }

    setMapInstance = (m) => {
        this.setState({
            mapInstance: m
        });
    }

    address = (a) => {
        let d = {...this.state};
        if(this.state.set)
            d.form.pickup = a;
        else
            d.form.destination = a;
        this.setState(d);
        if(this.checkOnlyUnempty()) {
            this.props.setData(this.state.form);
        }
    }

    checkOnlyUnempty = () => {
        let total = Object.keys(this.state.form).length;
        let field_arr = [];
        for(let s in this.state.form)
          if(this.state.form[s] !== '' && this.state.form[s] !== ' ')
            field_arr.push(s);
    
        if(field_arr.length === total)
          return true;
        else
          return false;
    }

    setApi = (b, m, ms) => {
        let d = {...this.state};
        d.mapApiLoaded = b;
        d.mapInstance = m;
        d.mapApi = ms;
        this.setState(d);
    }

    addPlace = (p) => {
        let d = {...this.state};
        d.place = p;
        this.setState(d);
    }

    setBar = (b) => {
        let d = {...this.state};
        if(b === "p")
            d.set = true;
        else if(b === "d")
            d.set = false;
        this.setState(d, () => {
            this.buttonAttr();
        });
    }

    handleButton(b) {
        let d = {...this.state};
        if(b === "p")
            d.form.pickup = ' ';
        else if(b === "d")
            d.form.destination = '';
        this.setState(d, () => {
            this.buttonAttr();
        });
    }

    buttonAttr() {
        if(this.state.form.pickup.trim().length === 0 || this.state.form.destination.trim().length === 0)
            return {
                disabled: 'true'
            };
    }

    proceed() {
    }
    
    componentWillMount() {
        //in case there are previous values coming from parent    
        let prevData = this.props.sendData;
        let d = {...this.state};
        for(let a in prevData)
            d['form'][a] = prevData[a];
    }

    render() {
        const { mapApiLoaded, mapInstance, mapApi } = this.state;
        return(
            <div>
                <table style={{ height: '40vh', width: '100%' }}>
                    <tr>
                        <td style={{ height: '20vh', width: '100%' }}>
                            <Map
                                Mkey="AIzaSyAGz6Z8U8Y7jlT9abxQzDDlIHscbNn1cjI"
                                libraries={['places', 'geometry']}
                                MapApi={this.setMapApi}
                                MapInstance={this.setMapInstance}
                                place={this.state.place}
                                address={this.address}
                                setApi={this.setApi}
                            />
                        </td>
                        <td style={{height: '20vh'}}>
                            <Container>
                            {mapApiLoaded && (
                                <div>
                                    <h5>Pickup Location</h5>
                                    <Address key={this.state.form.pickup} address={this.state.form.pickup} map={mapInstance} mapApi={mapApi} addplace={this.addPlace} identity="p" bar={this.setBar} isempty={this.handleButton} />
                                    <br /><br />
                                    <h5>Destination Location</h5>
                                    <Address key={this.state.form.destination} address={this.state.form.destination} map={mapInstance} mapApi={mapApi} addplace={this.addPlace} identity="d" bar={this.setBar} isempty={this.handleButton} />
                                    <br /><br />
                                    <p><strong>Note:</strong> Double click on the location on map to get the address in address bar.</p>
                                </div>
                            )}
                            </Container>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
};

export default IntraCity;