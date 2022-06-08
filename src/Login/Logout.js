import React from 'react';
import ReactSession from 'react-client-session/dist/ReactSession';

export class Logout extends React.Component {
    constructor() {
        super();
        ReactSession.setStoreType("localStorage");
        var s = ReactSession.get("userID");
        console.log(typeof s);
        if(typeof s !== "number")
            window.location = './';
        ReactSession.remove("userID");
        if(ReactSession.get("custID") !== undefined)
            ReactSession.remove("custID");
        else if(ReactSession.get("drivID") !== undefined)
            ReactSession.remove("drivID");
        else
            ReactSession.remove("adminID");
        window.location = './';
    }

    
}

export default Logout;