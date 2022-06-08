import React from 'react';
import SignUp from '../SignUp/SignUp';
import './SignUpAdmin.css';

export class SignUpAdmin extends React.Component {
    render() {
        return(
            <div>
                <br />
                <div class="signup-body">
                    <SignUp user="admin" />
                </div>
            </div>
        );
    }
};

export default SignUpAdmin;