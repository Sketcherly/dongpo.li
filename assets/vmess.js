function toBinaryStr(str) {
    const encoder = new TextEncoder();
    // 1: split the UTF-16 string into an array of bytes
    const charCodes = encoder.encode(str);
    // 2: concatenate byte data to create a binary string
    return String.fromCharCode(...charCodes);
}

const tpl = {
    "add": "4.00888.xyz",
    "aid": "0",
    "alpn": "",
    "fp": "chrome",
    "host": "4.00888.xyz",
    "id": "ce57d713-c4f6-44bb-a59d-737a6080bb93",
    "net": "ws",
    "path": "/ZIq0394bkpr7Dj82",
    "port": "443",
    "ps": "美国-3",
    "scy": "auto",
    "sni": "4.00888.xyz",
    "tls": "tls",
    "type": "",
    "v": "2"
};

let responseBody = '';

let servers = [
    {
        "host": "0",
        "name": "美国-1-(洛杉矶-BWH-GIA)"
    },
    {
        "host": "1",
        "name": "美国-2-(洛杉矶-BWH-GIA)"
    },
    {
        "host": "2",
        "name": "美国-3-(洛杉矶-DMIT-GIA)",
        "uid": "85d105b9-ebbf-40db-9a0d-7b66f3f81db6"
    },
    {
        "host": "8",
        "name": "美国-4-(洛杉矶-RN)"
    },
    {
        "host": "9",
        "name": "法国-1-(斯特拉斯堡-RN)"
    }
];
let domain = '00888.xyz';

let protocol = "vmess://";

for (let i = 0; i < servers.length; i++) {
    const element = servers[i];

    let host = element.host + '.' + domain;

    let obj = Object.create(tpl);

    obj.add = host;
    obj.host = host;
    obj.sni = host;
    obj.ps = element.name;

    if (element['uid']) {
        obj.id = element.uid;
    } else {
        obj.id = tpl.id;
    }

    // console.log(JSON.stringify(obj))

    // console.log(protocol + btoa(toBinaryStr(JSON.stringify(obj))));

    responseBody += protocol + btoa(toBinaryStr(JSON.stringify(obj))) + '\n';
}

console.log(responseBody)