import React from 'react';
import SignMain from './SignUp/SignMain';
import AdminSignUp from './SignUp/AdminSignUp';
import { Login } from './Login/Login';
import { Logout } from './Login/Logout';
import { Truck } from './Business/book/Truck';
import { TruckReg } from './Business/reg/TruckReg';
import { TruckAssign } from './Business/reg/TruckAssign';
import { InterCity } from './Business/book/InterCity';
import { IntraCity } from './Business/book/IntraCity';
import './App.css';
import Slider from './ui/Slider';
import NavigationBar from './ui/NavigationBar';
import FrontContent from './ui/FrontContent';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Customer from './ui/pages/Customer';
import Admin from './ui/pages/Admin';
import SignUpAdmin from './SignUp/SignUpAdmin';
import Footer from './ui/Footer';
import FooterSimple from './ui/FooterSimple';
//import Route from './Business/reg/Route';
function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route path="/reg_admin">
          <SignUpAdmin />
          <FooterSimple />
        </Route>
        <Route path="/admin">
          <Admin />
          <FooterSimple />
        </Route>
        <Route path="/login">
          <Login />
          <FooterSimple />
        </Route>
        <Route path="/signup">
          <SignMain />
          <FooterSimple />
        </Route>
        <Route path="/customer">
          <Customer />
          <FooterSimple />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/">
          <NavigationBar />
          <Slider />
          <FrontContent />
          <Footer />
        </Route>
      </Switch>
    </Router>
    </>
  );
}

export default App;