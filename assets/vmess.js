function toBinaryStr(str) {
    const encoder = new TextEncoder();
    // 1: split the UTF-16 string into an array of bytes
    const charCodes = encoder.encode(str);
    // 2: concatenate byte data to create a binary string
    return String.fromCharCode(...charCodes);
}

// // ws方式的vmess，没有节点在用了，废弃
// const tpl = {
//     "add": "4.00888.xyz",
//     "aid": "0",
//     "alpn": "",
//     "fp": "chrome",
//     "host": "4.00888.xyz",
//     "id": "ce57d713-c4f6-44bb-a59d-737a6080bb93",
//     "net": "ws",
//     "path": "/ZIq0394bkpr7Dj82",
//     "port": "443",
//     "ps": "美国-3",
//     "scy": "auto",
//     "sni": "4.00888.xyz",
//     "tls": "tls",
//     "type": "",
//     "v": "2"
// };

// let responseBody = '';

// let servers = [
//     // {
//     //     "domain": "888888888.uk",
//     //     "host": "1",
//     //     "name": "美国-2-(洛杉矶-BWH-GIA)"
//     // },
//     // {
//     //     "domain": "00888.xyz",
//     //     "host": "2",
//     //     "name": "美国-3-(洛杉矶-DMIT-GIA)",
//     //     "uid": "85d105b9-ebbf-40db-9a0d-7b66f3f81db6"
//     // },
//     {
//         "domain": "888888888.uk",
//         "host": "9",
//         "name": "美国-9-(洛杉矶-RN-备用)"
//     },
//     // {
//     //     "domain": "00888.xyz",
//     //     "host": "9",
//     //     "name": "法国-1-(斯特拉斯堡-RN)"
//     // }
// ];


// let protocol = "vmess://";

// for (let i = 0; i < servers.length; i++) {
//     const element = servers[i];

//     let host = element.host + '.' + element.domain;

//     let obj = Object.assign({}, tpl);

//     obj.add = host;
//     obj.host = host;
//     obj.sni = host;
//     obj.ps = element.name;

//     if (element['uid']) {
//         obj.id = element.uid;
//     } else {
//         obj.id = tpl.id;
//     }

//     // console.log(JSON.stringify(obj))

//     console.log(protocol + btoa(toBinaryStr(JSON.stringify(obj))));

//     // responseBody += protocol + btoa(toBinaryStr(JSON.stringify(obj))) + '\n';
// }

// console.log(responseBody)

// // ws方式的vmess，没有节点在用了，废弃  END


let protocol = "vmess://";
const vmess_tcp_tls_tpl = {
    "fp": "chrome",
    "port": "443",
    "security": "none",
    "ps": "TCP-TLS",
    "type": "none",
    "host": "",
    "aid": "0",
    "id": "ce57d713-c4f6-44bb-a59d-737a6080bb93",
    "net": "tcp",
    "sni": "",
    "tls": "tls",
    "v": "2",
    "add": "4.888888888.uk",
    "path": ""
}
let vmess_tcp_tls_servers = [
    // 0
    {
        "domain": "888888888.uk",
        "host": "0",
        "name": "规则",
        "uid": "7778bc68-9df0-4891-84c5-696de94c8531"
    },
    {
        "domain": "888888888.uk",
        "host": "0",
        "name": "直连",
        "uid": "ce57d713-c4f6-44bb-a59d-737a6080bb93"
    },
    {
        "domain": "888888888.uk",
        "host": "0",
        "name": "美国-亚利桑那州-梅萨",
        "uid": "b63e5bf6-cfc9-4b47-a07d-cd8be0f63a70"
    },
    {
        "domain": "888888888.uk",
        "host": "0",
        "name": "！美国",
        "uid": "1a92a59b-e345-43c5-b822-87bb4ac7b51c"
    },

    // 8
    {
        "domain": "888888888.uk",
        "host": "8",
        "name": "备用",
        "uid": "ce57d713-c4f6-44bb-a59d-737a6080bb93"
    },

    // 3
    {
        "domain": "888888888.uk",
        "host": "3",
        "name": "洛杉矶-BWH-将过期-直连",
        "uid": "ce57d713-c4f6-44bb-a59d-737a6080bb93"
    },

    // 4
    {
        "domain": "888888888.uk",
        "host": "4",
        "name": "大阪-BWH-直连"
    },

    // // 5
    // {
    //     "domain": "888888888.uk",
    //     "host": "5",
    //     "name": "洛杉矶-DMIT-主-直连",
    //     "uid": "ce57d713-c4f6-44bb-a59d-737a6080bb93"
    // },
    // {
    //     "domain": "888888888.uk",
    //     "host": "5",
    //     "name": "洛杉矶-DMIT-主-落地(亚利桑那-梅萨)",
    //     "uid": "b63e5bf6-cfc9-4b47-a07d-cd8be0f63a70"
    // },
    // {
    //     "domain": "888888888.uk",
    //     "host": "5",
    //     "name": "洛杉矶-DMIT-主-落地(香港)",
    //     "uid": "1a92a59b-e345-43c5-b822-87bb4ac7b51c"
    // },

    // // 6
    // {
    //     "domain": "888888888.uk",
    //     "host": "6",
    //     "name": "洛杉矶-DMIT-将过期-直连",
    //     "uid": "ce57d713-c4f6-44bb-a59d-737a6080bb93"
    // },
    // {
    //     "domain": "888888888.uk",
    //     "host": "6",
    //     "name": "洛杉矶-DMIT-将过期-落地(亚利桑那-梅萨)",
    //     "uid": "b63e5bf6-cfc9-4b47-a07d-cd8be0f63a70"
    // }
];

for (let i = 0; i < vmess_tcp_tls_servers.length; i++) {
    const element = vmess_tcp_tls_servers[i];

    let host = element.host + '.' + element.domain;

    let obj = Object.assign({}, vmess_tcp_tls_tpl);

    obj.add = host;
    obj.ps = element.name;

    if (element['uid']) {
        obj.id = element.uid;
    } else {
        obj.id = vmess_tcp_tls_tpl.id;
    }

    // console.log(JSON.stringify(obj))

    console.log(protocol + btoa(toBinaryStr(JSON.stringify(obj))));
    if (i == 4) {
        console.log('\n\n\n\n\n');
    }

    // responseBody += protocol + btoa(toBinaryStr(JSON.stringify(obj))) + '\n';
}