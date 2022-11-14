import React from 'react';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import "react-alice-carousel/lib/alice-carousel.css";
import './Banner.css';
import { FaAngleRight } from 'react-icons/fa';
import ReactSession from 'react-client-session/dist/ReactSession';

export class Banner extends React.Component {
    constructor() {
        super();
        ReactSession.setStoreType("localStorage");
    }

    render() {
        return(
            <div id="banner">
                <div id="content">
                    <Typography>
                        Your daily logistics partner
                    </Typography><br />
                    <p id="tagline">Logistics but easier</p><br />
                    <Button onClick={(e) => {if(typeof ReactSession.get("custID") === "number") window.location='./customer'; else if (typeof ReactSession.get("adminID") === "number") window.location='./admin'; else if(typeof ReactSession.get("drivID") === "number") window.location='./driver'; else window.location='./login'}} id="main-btn">
                        Get Started 
                        <FaAngleRight style={{width: '40px', height: '20px'}} />
                    </Button>
                </div>
            </div>
        );
    }
};

export default Banner;