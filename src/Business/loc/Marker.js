import React, { Component } from 'react';
import './Marker.css';

export class Marker extends Component {
    render() {
        return(
            <div className="point" style={
                {
                    backgroundColor: this.props.color,
                    cursor: 'pointer'
                }
                }>
                <div className="hole">

                </div>
            </div>
        );
    }
};

export default Marker;