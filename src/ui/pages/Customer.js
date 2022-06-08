import { Component } from 'react';
import Sidemenu from '../Sidemenu';
import './Customer.css';

export class Customer extends Component {    
    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <Sidemenu />
            </div>
        );
    }
};

export default Customer;