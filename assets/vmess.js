function toBinaryStr(str) {
    const encoder = new TextEncoder();
    // 1: split the UTF-16 string into an array of bytes
    const charCodes = encoder.encode(str);
    // 2: concatenate byte data to create a binary string
    return String.fromCharCode(...charCodes);
}

let tpl = {
    "add": "4.00888.xyz",
    "aid": "0",
    "alpn": "h2",
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
    "type": "http",
    "v": "2"
};

let responseBody = '';


let servers = {
    "0": "美国-1-(洛杉矶-BWH-GIA)",
    "1": "美国-2-(洛杉矶-BWH-GIA)",
    "2": "美国-3-(洛杉矶-DMIT-GIA)",
    "8": "美国-4-(洛杉矶-RN)",
    "9": "法国-1-(斯特拉斯堡-RN)"
};
let domain = '00888.xyz';

let protocol = "vmess://";

for (const key in servers) {
    if (Object.hasOwnProperty.call(servers, key)) {
        const element = servers[key];

        let host = key + '.' + domain;

        tpl.add = host;
        tpl.host = host;
        tpl.sni = host;
        tpl.ps = servers[key];

        responseBody += protocol + btoa(toBinaryStr(JSON.stringify(tpl))) + '\n';
    }
}


console.log(responseBody)