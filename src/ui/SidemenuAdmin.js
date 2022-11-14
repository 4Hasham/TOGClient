import React from 'react';
import "./SidemenuAdmin.css";
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
import { FaMap, FaTruck, FaCheck } from "react-icons/fa";
import { FiHome, FiLogOut } from "react-icons/fi";
import { BiCog } from "react-icons/bi";
import "react-pro-sidebar/dist/css/styles.css"; 
import Home from './pages/admin/Home';
import TruckAssign from '../Business/reg/TruckAssign';
import IntercityRoute from '../Business/reg/IntercityRoute';
import VerifyDrivers from './pages/admin/VerifyDrivers';

export class SidemenuAdmin extends React.Component {

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
                        <MenuItem icon={<FaMap />}><Link to={`/admin/route`}>Intercity Route</Link></MenuItem>
                        <MenuItem icon={<FaTruck />}><Link to={`/admin/assign`}>Truck Assign</Link></MenuItem>
                        <MenuItem icon={<FaCheck />}><Link to={`/admin/verifyDrivers`}>Verify Drivers</Link></MenuItem>
                        <MenuItem icon={<BiCog />}><Link to={`${match.url}/`}>Settings</Link></MenuItem>
                        </Menu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Menu iconShape="square">
                            <MenuItem icon={<FiLogOut />}><a href="../logout">Logout</a></MenuItem>
                        </Menu>
                    </SidebarFooter>
                    </ProSidebar>
                </div>
                <Switch>
                    <Route path={`${match.url}/route`}>
                        <IntercityRoute />
                    </Route>
                    <Route path={`${match.url}/assign`}>
                        <TruckAssign />
                    </Route>
                    <Route path={`${match.url}/verifyDrivers`}>
                        <VerifyDrivers />
                    </Route>
                    <Route path={`${match.url}/`}>
                        <Home />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

const SidemenuAdminM = withRouter(SidemenuAdmin);
export default SidemenuAdminM;