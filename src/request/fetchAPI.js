import { auth } from './header';

export function fetchAPI(route, options = null) {
    return new Promise((resolve, reject) => {
        var opt;
        if(options !== null) {
            opt = {...options};
            for(let a in auth)
                opt['headers'][a] = auth[a];
        }
        else {
            opt = {
                method: "GET",
                headers: {...auth}                
            }
        }
        fetch("../" + route, opt)
        .then((value) => {
            resolve(value);
        });
    });
};