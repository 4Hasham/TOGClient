import './PersonalSignUp.css';
import React, {Component} from 'react';
import { FormControl, FormLabel, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import { Container, TextField } from '@material-ui/core';
import { validateName, validateDate } from '../utils/Validation';

export class PersonalSignUp extends Component {

  constructor() {
    super();

    this.state = {
      fname: "",
      lname: "",
      gender: "",
      dob: "",
      errors: {
        fname: "",
        lname: "",
        gender: "",
        dob: ""
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
      console.log(this.state);
      if(this.checkOnlyUnempty()) {
        this.props.setCompleted(1);
        this.props.setData(this.state);
      }
      else {
        this.props.setCompleted(0);
      }
    });
  }

  validateFname() {
    var s = {...this.state};
    if(validateName(this.state.fname) < 0) {
      s.errors.fname = "First name cannot be greater than 14 characters and smaller than 2 characters.";
      this.setState(s);
    }
    else if(validateName(this.state.fname) > 0) {
      s.errors.fname = "Enter one name.";
      this.setState(s);
    }
    else {
      s.errors.fname = "";
      this.setState(s);
      return true;
    }
    return false;
  }

  validateLname() {
    var s = {...this.state};
    if(validateName(this.state.lname) < 0) {
      s.errors.lname = "Last name cannot be greater than 14 characters and smaller than 2 characters.";
      this.setState(s);
    }
    else if(validateName(this.state.lname) > 0) {
      s.errors.lname = "Enter one name.";
      this.setState(s);
    }
    else {
      s.errors.lname = "";
      this.setState(s);
      return true;
    }
    return false;
  }

  validateGender() {
    var s = {...this.state};
    if(validateName(this.state.gender) !== 0) {
      s.errors.gender = "Please select your gender.";
      this.setState(s);
      return false;
    }
    else {
      s.errors.gender = "";
      this.setState(s);
      return true;
    }
  }

  validateDOB() {
    var s = {...this.state};
    if(!validateDate(this.state.dob)) {
      s.errors.dob = "Not a valid date, please select a valid date with the format mm-dd-yyyy.";
      this.setState(s);
      return false;
    }
    else {
      s.errors.dob = "";
      this.setState(s);
      return true;
    }
  }

  validateForm(field) {
    switch(field) {
      case 'fname':
        this.validateFname();
      break;
      case 'lname':
        this.validateLname();
      break;
      case 'gender':
        this.validateGender();
      break;
      case 'dob':
        this.validateDOB();
      break;
      default:
        return (
          this.validateFname() &&
          this.validateLname() &&
          this.validateGender() &&
          this.validateDOB()
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

  componentWillUnmount() {
    this.props.setData(this.state);
    if(this.checkOnlyUnempty())
      this.props.setCompleted(1);
    else
      this.props.setCompleted(0);
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
            <TextField {... this.errorAttr('fname')} name="fname" label="First Name" value={this.state.fname} onChange={this.setValues} />&nbsp;&nbsp;
            <TextField {... this.errorAttr('lname')} name="lname" label="Last Name" value={this.state.lname} onChange={this.setValues} />
            <br /><br />
            <TextField {... this.errorAttr('dob')} type="date" name="dob" label="Date of Birth" InputLabelProps={{shrink: true}} value={this.state.dob} onChange={this.setValues} />
            <br /><br />
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup {... this.errorAttr('gender')} aria-label="gender" name="gender" value={this.state.gender} onChange={this.setValues}>
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
              </RadioGroup>
            </FormControl>
            <br /><br />
          </form><br /><br />
      </Container>
    );
  }  
}

export default PersonalSignUp;