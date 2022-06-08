export function isAlpha(s) {
    var str = s.trim();
    for(let i = 0; i < str.length; ++i)
        if(str.charCodeAt(i) < 65 || str.charCodeAt(i) > 122)
            return false;
    return true;
}

export function isNumeric(s) {
    var str = s.trim();
    for(let i = 0; i < str.length; ++i) 
        if(str.charCodeAt(i) < 48 || str.charCodeAt(i) > 57)
            return false;
    return true;
}

export function containsSpace(s) {
    var str = s.trim();
    if(str.length === 0)
        return false;

    for(let i = 0; i < str.length; ++i) 
        if(str.charCodeAt(i) === 32)
            return true;
    return false;
}

export function isAlphaNumeric(s) {
    var str = s.trim();
    for(let i = 0; i < str.length; ++i) {
        if(str.charCodeAt(i) < 48 || (str.charCodeAt(i) > 57 && str.charCodeAt(i) < 65) || str.charCodeAt(i) > 122) {
            return false;
        }
    }
    return true;
}

export function validateName(s) {
    var str = s.trim();
    if(str.length === 0)
        return 1;
    if(str.length < 2 || str.length > 14)
        return -1; //not within valid range of string length
    else if(!isAlpha(str) || containsSpace(str))
        return 1; //contains numbers, spaces or other characters
    else
        return 0; //all good
}

export function validateEmail(s) {
    var str = s.trim();
    if(str.length === 0)
        return false;
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(str))
        return true;
    return false;
}


export function validatePhone(s) {
    var str = s.trim();
    if(str.length < 10 || str.length > 11)
        return false;
    if(!isNumeric(str) || containsSpace(str))
        return false;
    return true;
}

export function validateDate(s) {
    if(s.length === 0)
        return false;
    return true;
}

export function validatePassword(s) {
    var str = s.trim();
    var regex =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;
    if(str.match(regex)) { 
        return true;
    }
}