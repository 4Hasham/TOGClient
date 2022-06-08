import React from 'react';
import { FaCity, FaMap } from "react-icons/fa";
import { Button, Alert } from 'react-bootstrap';
import "./Home.css";
import PropTypes from "prop-types";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter
} from "react-router-dom";
import Intracity from './Intracity/Intracity';
import Intercity from './Intercity/Intercity';
import History from './History';

export class Home extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            n: "",
            info: ""
        }
    }

    setN = (txt) => {
        let d = {...this.state};
        d.n = txt;
        this.setState(d);
    }

    setInfo = (txt) => {
        let d = {...this.state};
        d.info = txt;
        this.setState(d);
    }

    mouseOver = (e) => {
        var n = e.target.attributes.name.nodeValue;
        switch(n) {
            case "intercity": {
                var t = "Send your luggage to another city. Make sure you know your luggage." + 
                " There will be a fixed pickup and destination location of goods." +
                " Select weight category carefully. Your booking is subject to the driver's decision to accept.";
                this.setN(n);
                this.setInfo(t);
            }
            break;
            case "intracity": {
                var t = "Transfer goods within your city. Our driver will pickup and drop the goods on the " +
                "exact loctions as defined by user." + 
                " Select weight category carefully. Your booking is subject to the driver's decision to accept.";
                this.setN(n);
                this.setInfo(t);
            }
            break;
        }
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };
    
    render() {
        const { match, location, history } = this.props;
        return (
            <Router>
                <div id="home-main">
                    {(location.pathname!=='/customer/intracity' && location.pathname!=='/customer/intercity') && (
                    <>
                    <h2>Select a mode</h2>
                    <div id='home-btn'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Button name="intracity" onClick={() => { window.location=`${match.url}/intracity` }} variant="primary" size="lg" onMouseOver={this.mouseOver}>
                                            <FaCity /> Intracity
                                        </Button>
                                    </td>
                                    <td>
                                    <Button name="intercity" onClick={() => { window.location=`${match.url}/intercity` }} variant="primary" size="lg" onMouseOver={this.mouseOver}>
                                        <FaMap /> Intercity
                                    </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {this.state.info.trim().length > 0 && (
                    <Alert variant="success">
                        <Alert.Heading>{this.state.n}</Alert.Heading>
                        <p>
                            {this.state.info}
                        </p>
                    </Alert>
                    )}
                    </>
                    )}
                    <Switch>
                        <Route path={`${match.url}/intracity`}>
                            <Intracity />
                        </Route>
                        <Route path={`${match.url}/intercity`}>
                            <Intercity />
                        </Route>
                    </Switch>

                </div>
            </Router>
        );
    }
}

const HomeR = withRouter(Home);
export default HomeR;