import React from 'react';
import { Typography } from '@material-ui/core';
import "./Wallet.css";
import ReactSession from 'react-client-session/dist/ReactSession';

export class Wallet extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 0
        }
        ReactSession.setStoreType("localStorage");
    }

    componentDidMount = () => {
        this.loadPrev()
    }

    loadPrev = async() => {
        var dat = await new Promise((resolve, reject) => {
            fetch("../users/getWallet?walletID=" + ReactSession.get("userID"))
            .then((res) => {
                resolve(res.json());
            });
        });
        let d = {...this.state};
        console.log(dat);
        d.value = dat.amount;
        this.setState(d);
    }

    render() {
        return (
            <div>
                <div id="home-main">
                    <h3>Wallet Credit</h3>
                    <br />
                    <Typography>
                        Rs. {this.state.value}
                    </Typography>
                </div>
            </div>
        );
    }
}

export default Wallet;