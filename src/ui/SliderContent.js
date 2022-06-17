import React from 'react';
import Typography from '@material-ui/core/Typography';
import "react-alice-carousel/lib/alice-carousel.css";
import './SliderContent.css';
import { Button } from 'react-bootstrap';
import ReactSession from 'react-client-session/dist/ReactSession';

export class SliderContent extends React.Component {
    constructor() {
        super();
        ReactSession.setStoreType("localStorage");
    }

    render() {
        return(
            <div id="home" className="cont">
                <Typography variant="h2" className="cont_txt">
                    {this.props.cont}
                </Typography>
                <div className="invite">
                    <table>
                        <tr>
                            <td>
                                <Button className='invite-btn' onClick={(e) => {if(typeof ReactSession.get("custID") === "number") window.location='./customer'; else if (typeof ReactSession.get("adminID") === "number") window.location='./admin'; else if(typeof ReactSession.get("drivID") === "number") window.location='./driver'; else window.location='./login'}} variant="primary">
                                 Get Started
                                </Button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
};

export default SliderContent;