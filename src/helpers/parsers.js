function parseString(str) {
    return str.substring(str.indexOf('"')+1,str.lastIndexOf('"'))
}

function parseMail(str) {
    let ident = "mailto:";
    let index = str.indexOf(ident);
    if (index != -1) {
        return str.substring(index + ident.length);
    } else {
        return str;
    }
}

function parseGender(str) {
    let gender = parseString(str);
    if (gender.toLowerCase() === 'man') {
        return 'male';
    } else if (gender.toLowerCase() === 'vrouw') {
        return 'female';
    } else {
        return gender.toLowerCase();
    }
}

function parseDate(str) {
    return new Date(parseString(str));
}


export default { parseString, parseDate, parseGender, parseMail }
