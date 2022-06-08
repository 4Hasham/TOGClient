import React from 'react';
import "./Home.css";

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="home-main">
                <h3>Level: 0</h3>
            </div>
        );
    }
}

export default Home;