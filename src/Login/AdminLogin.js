import { React, Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import { isAlphaNumeric, validatePassword } from '../utils/Validation';
import ReactSession from 'react-client-session/dist/ReactSession';
import './AdminLogin.css';
import { fetchAPI } from '../request/fetchAPI';

export class AdminLogin extends Component {
    constructor() {
        super();

        this.state = {
            form: {
                user: '',
                pass: ''
            },
            error: {
                user: '',
                pass: '',
                msg: ''
            }
            ,
            valid: false
        };
        ReactSession.setStoreType("localStorage");
    }

    sendInfo = async() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.form)
      };
      let str = new Promise((resolve, reject) => {
        fetchAPI("admin/login", requestOptions).then((res) => {
          if(res.status == 200) {
            resolve(res.json());
          }
          else {
            resolve("__null");
          }
        });
      });
      var res = await str;
      let d = {...this.state};
      if(res !== "__null") {
        if(res.adminID > 0) {
          ReactSession.set("adminID", res.adminID);
          ReactSession.set("userID", res.userID);
          window.location = '/';
        }
        else {
          d.error.msg = "Invalid username/password.";
        }
      }
      else {
        d.error.msg = "Error occurred.";
      }
      this.setState(d);
    }  
  
    updateState = (e) => {
        var t = e.target;
        var d = {...this.state};
        d.form[t.name] = t.value; 
        this.setState(d, this.validateForm(t.name));
        if(!this.checkBool(['user', 'pass']))
            d.valid = false;
        else
            d.valid = true;
        this.setState(d)
    }

    isEmptyState = () => {
        for(let c in this.state.form) {
            if(typeof this.state.form[c] === 'string' || this.state.form[c] instanceof String)
                if(this.state.form[c].trim() === '')
                    return true;
        }
        return false;
    }

    errorAttr(field) {
        if(this.state.error[field] !== "")
        return {
            error: true,
            helperText: this.state.error[field]
        };
    }

    _validateUser() {
        var s = {...this.state};
        if(!isAlphaNumeric(this.state.form.user)) {
          s.error.user = "Please enter a valid user address.";
          this.setState(s);
          return false;
        }
        else {
          s.error.user = "";
          this.setState(s);
          return true;
        }
      }
    
      _validatePass() {
        var s = {...this.state};
        if(!validatePassword(this.state.form.pass)) {
          s.error.pass = "You password must comprise of at least 7 characters, and it must have at least one number and special character.";
          this.setState(s);
          return false;
        }
        else {
          s.error.pass = "";
          this.setState(s);
          return true;
        }
      }

    validateForm(field) {
        switch(field) {
          case 'user':
            this._validateUser();
          break;
          case 'pass':
            this._validatePass();
          break;
          default:
            return (
                this._validateUser() &&
                this._validatePass()
            );
        }
    }

    buttonAttr = () => {
        if(!this.state.valid) {
            return {disabled: true};
        }
    }

    checkBool = (arr) => {
        let b = true;
        for(let i in arr) {
          b = b && this.validateForm(i);
        }
        return b;
    }
    
    checkOnlyUnempty = () => {
        let total = Object.keys(this.state.form).length;
        let field_arr = [];
        for(let s in this.state.form)
          if(this.state.form[s] !== '')
            field_arr.push(s);
    
        if(field_arr.length === total && this.checkBool(field_arr))
          return true;
        else
          return false;
    }

    render() {
        return(
            <div class="login">
                <p style={{color: 'red'}}>{this.state.error.msg}</p>
                <TextField className='txtarea' {... this.errorAttr('user')} name="user" value={this.state.form.user} label="Username" type="text" onChange={this.updateState} /><br />
                <br />
                <TextField className='txtarea' {... this.errorAttr('pass')} name="pass" value={this.state.form.pass} label="Password" type="password" onChange={this.updateState} /><br />
                <br />
                <Button className='loginbtn' {...this.buttonAttr()} variant="contained" onClick={this.sendInfo} color="primary">Login</Button>
            </div>
        );
    }
};

export default AdminLogin;