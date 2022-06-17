import { Component } from 'react';
import SidemenuDriver from '../SidemenuDriver';
import './Driver.css';

export class Driver extends Component {    
    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <SidemenuDriver />
            </div>
        );
    }
};

export default Driver;