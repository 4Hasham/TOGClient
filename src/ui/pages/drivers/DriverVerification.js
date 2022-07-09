import { Input, Button } from '@material-ui/core';
import { Alert } from 'react-bootstrap';
import { Component } from 'react';
import axios from 'axios';
import { auth } from '../../../request/header';
import ReactSession from 'react-client-session/dist/ReactSession';
import './DriverVerification.css';

export class DriverVerification extends Component {    
    constructor() {
        super();
        this.state = {
            clicked: false,
            form: {
                cnicFront: null,
                cnicBack: null,
                licenseFront: null,
                licenseBack: null
            }
        };
        ReactSession.setStoreType("localStorage");
    }

    setFile = (n, f) => {
        var d = {...this.state};
        d.form[n] = f;
    }

    handleChange = (event) => {
        this.setFile(event.target.name, event.target.files[0]);
    }

    submitForm = async(event) => {
        event.preventDefault();
        document.getElementById('submit').disabled = true;
        const formData = new FormData();
        formData.append('driverID', ReactSession.get('drivID'));
        formData.append('cnicFront', this.state.form.cnicFront);
        formData.append('cnicBack', this.state.form.cnicBack);
        formData.append('licenseFront', this.state.form.licenseFront);
        formData.append('licenseBack', this.state.form.licenseBack);
        try {
            const res = await axios.post(
              "../drivers/setDriverInfo",
              formData, {
                headers: {...auth}
              }
            );
            var d = {...this.state};
            d.clicked = true;
            this.setState(d);
        } catch (ex) {
            console.log(ex);
        }
    }

    render() {
        return (
                <div id='home-main'>
                {(this.state.clicked === false) &&
                <div>
                    <Alert variant="info">
                        <Alert.Heading>Important</Alert.Heading>
                        <p>
                            Make sure the pictures are clear. Administrator has the right to revoke your membership anytime.
                        </p>
                    </Alert>
                    <br /><br />
                    <form onSubmit={this.submitForm}>
                        <label>CNIC Front</label><br />
                        <Input type='file' name='cnicFront' onChange={this.handleChange} />
                        <br /><br />
                        <label>CNIC Back</label><br />
                        <Input type='file' name='cnicBack' onChange={this.handleChange} />
                        <br /><br />
                        <label>License Front</label><br />
                        <Input type='file' name='licenseFront' onChange={this.handleChange} />
                        <br /><br />
                        <label>License Back</label><br />
                        <Input type='file' name='licenseBack' onChange={this.handleChange} />
                        <br /><br /><br />
                        <Button id="submit" type='submit' variant='contained' color='primary'>Submit</Button>
                    </form>
                    <br />
                </div>
                }
                {(this.state.clicked === true) &&
                    <Alert variant="success">
                        <Alert.Heading>You have submitted this form.</Alert.Heading>
                        <p>
                            Check the home tab to see your status.
                        </p>
                    </Alert>
                }
                </div>
        );
    }
};

export default DriverVerification;