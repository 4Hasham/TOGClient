import { Component } from 'react';
import SidemenuAdmin from '../SidemenuAdmin';
import './Admin.css';

export class Admin extends Component {    
    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <SidemenuAdmin />
            </div>
        );
    }
};

export default Admin;