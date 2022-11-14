import React from 'react';
import "./Sidemenu.css";
import History from './pages/customer/History';
import Wallet from './pages/customer/Wallet';
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
import { FaWallet, FaHistory, FaCity } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { BiCog } from "react-icons/bi";
import "react-pro-sidebar/dist/css/styles.css";
import Home from './pages/customer/Home';
import IntercityRides from './pages/customer/IntercityRides';
export class Sidemenu extends React.Component {

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
                        <MenuItem icon={<FaWallet />}><Link to={`/customer/wallet`}>Wallet</Link></MenuItem>
                        <MenuItem icon={<FaHistory />}><Link to={`/customer/history`}>History</Link></MenuItem>
                        <MenuItem icon={<FaCity />}><Link to={`/customer/intercityRides`}>Intercity Rides</Link></MenuItem>
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
                <div style={{minWidth: '100%', minHeight: '80vh'}}>
                <Switch>
                    <Route path={`${match.url}/wallet`}>
                        <Wallet />
                    </Route>
                    <Route path={`${match.url}/history`}>
                        <History />
                    </Route>
                    <Route path={`${match.url}/intercityRides`}>
                        <IntercityRides />
                    </Route>
                    <Route path={`${match.url}/settings`}>
                        
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

const SidemenuM = withRouter(Sidemenu);
export default SidemenuM;