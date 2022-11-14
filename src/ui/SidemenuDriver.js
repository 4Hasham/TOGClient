import React from 'react';
import "./Sidemenu.css";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from "react-pro-sidebar";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter
} from "react-router-dom";
import { Image } from 'react-bootstrap';
import { FaCheck, FaTruck } from "react-icons/fa";
import { FiHome, FiLogOut } from "react-icons/fi";
import { BiCog } from "react-icons/bi";
import "react-pro-sidebar/dist/css/styles.css";
import Home from './pages/drivers/Home';
import DriverVerification from './pages/drivers/DriverVerification';
import TruckReg from '../Business/reg/TruckReg';

export class SidemenuDriver extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuCollapse: true
        }

    }

    menuIconClick = () => {
        this.state.menuCollapse ? this.setMenuCollapse(false) : this.setMenuCollapse(true);
    }

    setMenuCollapse = (b) => {
        this.setState({
            menuCollapse: b
        });
    }

    render() {
        const { match, location, history } = this.props;
        return (
            <Router>
                <div id="header">
                    <ProSidebar collapsed={this.state.menuCollapse}>
                    <SidebarHeader>
                    <div style={{padding: 5}} className="logotext" onClick={this.menuIconClick}>
                        <Image src='../../logo.png' fluid />
                        </div>
                        {/* <div className="closemenu" onClick={this.menuIconClick}>
                        {this.state.menuCollapse ? (
                            <FiArrowRightCircle/>
                        ) : (
                            <FiArrowLeftCircle/>
                        )}
                        </div> */}
                    </SidebarHeader>
                    <SidebarContent>
                        <Menu iconShape="square">                     
                        <MenuItem icon={<FiHome />}><Link to={`${match.url}/`}>Home</Link></MenuItem>
                        <MenuItem icon={<FaTruck />}><Link to={`/driver/regTruck`}>Register Truck</Link></MenuItem>
                        <MenuItem icon={<FaCheck />}><Link to={`/driver/verify`}>Verification</Link></MenuItem>
                        </Menu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Menu iconShape="square">
                            <MenuItem icon={<FiLogOut />}><a href="../logout">Logout</a></MenuItem>
                        </Menu>
                    </SidebarFooter>
                    </ProSidebar>
                </div>
                <div style={{minWidth: '100%', minHeight: '80vh'}}>
                <Switch>
                    <Route path={`${match.url}/regTruck`}>
                        <TruckReg />
                    </Route>
                    <Route path={`${match.url}/verify`}>
                        <DriverVerification />
                    </Route>
                    <Route path={`${match.url}/`}>
                        <Home />
                    </Route>
                </Switch>
                </div>
            </Router>
        );
    }
}

const SidemenuDriverM = withRouter(SidemenuDriver);
export default SidemenuDriverM;