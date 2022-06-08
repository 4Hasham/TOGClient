import './DriverInfoSignUp.css';
import React, {Component} from 'react';
import { Container, TextField } from '@material-ui/core';
import { validatePhone, validatePassword } from '../utils/Validation';
export class DriverInfoSignUp extends Component {

  constructor() {
    super();

    this.state = {
      phone: "",
      pass: "",
      errors: {
        phone: "",
        pass: "",
      }
    };

    this.setValues = this.setValues.bind(this);
  }

  componentWillMount() {
    //in case there are previous values coming from parent

    let prevData = this.props.sendData;
    for(let a in prevData) {
      this.setState({[a]: prevData[a]});
    }    
  }

  setValues(e) {

    let target = e.target;
    let value = target.value;
    let name = target.name;
    this.setState({[name]: value}, () => {
      this.validateForm(name);
      this.props.setData(this.state);
      if(this.checkOnlyUnempty())
        this.props.setCompleted(1);
      else
        this.props.setCompleted(0);
      console.log("DRIVER DATA", this.props.sendData);  
    });
  }

  _validatePhone() {
    var s = {...this.state};
    if(!validatePhone(this.state.phone)) {
      s.errors.phone = "Please enter a valid phone number.";
      this.setState(s);
      return false;
    }
    else {
      s.errors.phone = "";
      this.setState(s);
      return true;
    }
  }

  _validatePass() {
    var s = {...this.state};
    if(!validatePassword(this.state.pass)) {
      s.errors.pass = "You password must comprise of at least 5 characters, and it must have at least one number and special character.";
      this.setState(s);
      return false;
    }
    else {
      s.errors.pass = "";
      this.setState(s);
      return true;
    }
  }

  validateForm(field) {
    switch(field) {
      case 'phone':
        this._validatePhone();
      break;
      case 'pass':
        this._validatePass();
      break;
      default:
        return (
          this._validatePhone() &&
          this._validatePass()
        );
    }
  }

  errorAttr(field) {
    if(this.state.errors[field] !== "")
      return {
        error: `true`,
        helperText: this.state.errors[field]
      };
  }

  checkBool(arr) {
    let b = true;
    for(let i in arr) {
      b = b && this.validateForm(i);
    }
    return b;
  }

  checkOnlyUnempty() {
    let total = Object.keys(this.state).length;
    let field_arr = [];
    for(let s in this.state)
      if(this.state[s] !== '')
        field_arr.push(s);

    if(field_arr.length === total && this.checkBool(field_arr))
      return true;
    else
      return false;
  }

  render() {
    return (
        <Container>
          <form id="custForm" name="custForm" className="custForm" noValidate autoComplete="false">
            <TextField {... this.errorAttr('phone')} type="tel" name="phone" id="standard-basic" label="Phone" value={this.state.phone} onChange={this.setValues} />
            <br /><br />
            <TextField {... this.errorAttr('pass')} type="password" name="pass" id="standard-basic" label="Password" value={this.state.pass} onChange={this.setValues} />
            <br /><br />
          </form><br /><br />
        </Container>
    )
  }
}

export default DriverInfoSignUp;