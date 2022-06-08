import React from 'react';
import Image from 'react-bootstrap/Image'
import './Simple.css';

export class Simple extends React.Component {
    constructor() {
        super();

        this.state = {

        };
    }

    render() {
        return(
            <div class="logo">
                <Image src='./logo.png'
                fluid={true}
                />
            </div>
        );
    }
};

export default Simple;