---
title: "99、0-自建梯子(vmess-ws-https).md"
date: 2024-03-21T11:45:08+08:00
draft: false
summary: '这是一篇早期尝试自己搭建梯子的方案，须知现在这个已经不是最终方案了。'
---

# 开始之前
自建梯子目前只能作为机场的备用方案，目前已知的问题有  
1、手机端无法同步TG消息，奇怪的是可以更新到消息数  


# 安装依赖软件
目前已知的依赖，已安装的请忽略
```
apt install vim
apt install curl
```

# 安装配置Nginx

## 安装
```
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

## 配置
先获取https的证书，备用  
注意要先配置私钥  
<!-- 123.57.205.181 -->
``` bash
# acme.sh --issue -d 888888888.uk -d *.888888888.uk --dns dns_cf

mkdir /etc/nginx/conf.d/cert
/root/.acme.sh/acme.sh --install-cert -d '888888888.uk' --key-file /root/zerossl/888888888.uk.key --fullchain-file /root/zerossl/888888888.uk.crt

scp /root/zerossl/888888888.uk.crt root@0.888888888.uk:/etc/nginx/conf.d/cert/0.888888888.uk.crt

scp /root/zerossl/888888888.uk.key root@0.888888888.uk:/etc/nginx/conf.d/cert/0.888888888.uk.key
```

配置文件
```
cat /etc/nginx/conf.d/0.888888888.uk.conf
```

``` text
server {
    listen       443 ssl http2;
    server_name *.888888888.uk;
    charset utf-8;

    # ssl配置
    ssl_protocols TLSv1.2 TLSv1.3; # tls 1.3要求nginx 1.13.0及以上版本
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_certificate /etc/nginx/conf.d/cert/0.888888888.uk.crt; # 改成你的证书地址
    ssl_certificate_key /etc/nginx/conf.d/cert/0.888888888.uk.key; # 改成证书密钥文件地址

    access_log  /var/log/nginx/0.888888888.uk.access.log;
    error_log /var/log/nginx/0.888888888.uk.error.log;

    root /usr/share/nginx/html;
    location / {
        proxy_redirect off;
        proxy_pass https://www.baidu.com; # 假装自己是百度
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        # proxy_set_header Host $host;
        proxy_set_header Host www.baidu.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /ZIq0394bkpr7Dj82 { # 与 V2Ray 配置中的 path 保持一致
        proxy_redirect off;
        proxy_pass http://127.0.0.1:12345; # 假设v2ray的监听地址是12345
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_send_timeout 3600s; # ws will open for 1 hour
        proxy_read_timeout 3600s; # ws will open for 1 hour
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
```
systemctl restart nginx
```

# 安装配置V2Ray

安装脚本官方项目
```
https://github.com/v2fly/fhs-install-v2ray

https://xtrojan.pro/bgfw/v2ray/v2ray-traffic-mask.html
```

```
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-dat-release.sh)
```

<!-- 
curl -o /usr/local/etc/v2ray/config.json 'https://www.dongpo.li/config.json'
 -->

```
vim /usr/local/etc/v2ray/config.json
```

``` json
{
  "log": {
    "loglevel": "warning",
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log"
   },
  "inbounds": [{
    "port": 12345,
    "protocol": "vmess",
    "settings": {
      "clients": [
        {
          "id": "****",
          "level": 1,
          "alterId": 0
        }
      ]
    },
    "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/ZIq0394bkpr7Dj82"
        }
      },
    "listen": "127.0.0.1"
  }],
  "outbounds": [{
    "protocol": "freedom",
    "settings": {}
  },{
    "protocol": "blackhole",
    "settings": {},
    "tag": "blocked"
  }],
  "routing": {
    "rules": [
      {
        "type": "field",
        "ip": ["geoip:private"],
        "outboundTag": "blocked"
      }
    ]
  }
}
```

```
systemctl restart v2ray
```

# 安装配置客户端

安装V2RayU  


<!-- id: ce57d713-c4f6-44bb-a59d-737a6080bb93 -->

配置
```
服务器设置
选择协议：vmess
address：0.888888888.uk
id：****

传输配置
选择网络：ws
host：0.888888888.uk
path：/ZIq0394bkpr7Dj82
serverName：0.888888888.uk


```

# V2RayU
```
{
  "log": {
    "loglevel": "info",
    "error": "",
    "access": ""
  },
  "inbounds": [
    {
      "listen": "127.0.0.1",
      "port": "1080",
      "protocol": "socks",
      "settings": {
        "udp": false,
        "auth": "noauth"
      }
    },
    {
      "port": "1087",
      "settings": {
        "timeout": 360
      },
      "listen": "127.0.0.1",
      "protocol": "http"
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "0.888888888.uk",
            "users": [
              {
                "alterId": 64,
                "level": 0,
                "security": "auto",
                "id": "****"
              }
            ],
            "port": 443
          }
        ]
      },
      "mux": {
        "enabled": false,
        "concurrency": 8
      },
      "streamSettings": {
        "security": "tls",
        "network": "ws",
        "wsSettings": {
          "headers": {
            "host": "0.888888888.uk"
          },
          "path": "/ZIq0394bkpr7Dj82"
        },
        "tlsSettings": {
          "allowInsecure": true,
          "fingerprint": "chrome",
          "serverName": "0.888888888.uk"
        }
      },
      "tag": "proxy"
    },
    {
      "tag": "direct",
      "settings": {
        "domainStrategy": "UseIP",
        "userLevel": 0
      },
      "protocol": "freedom"
    },
    {
      "tag": "block",
      "settings": {
        "response": {
          "type": "none"
        }
      },
      "protocol": "blackhole"
    }
  ],
  "dns": {},
  "routing": {
    "settings": {
      "rules": [],
      "domainStrategy": "AsIs"
    }
  }
}
```

# V2Ray-Core客户端配置
```
{
    "log": {
        "access": "/Users/dongpo.li/Software/v2ray-macos-arm64-v8a/logs/v2ray-core.log",
        "loglevel": "info",
        "error": "/Users/dongpo.li/Software/v2ray-macos-arm64-v8a/logs/v2ray-core.log"
    },
    "inbounds": [
        {
            "port": "1080",
            "protocol": "socks",
            "settings": {
                "udp": false,
                "auth": "noauth"
            },
            "listen": "127.0.0.1"
        },
        {
            "protocol": "http",
            "port": "1087",
            "listen": "127.0.0.1",
            "settings": {
                "timeout": 360
            }
        }
    ],
    "outbounds": [
        {
            "mux": {
                "enabled": false,
                "concurrency": 8
            },
            "tag": "proxy",
            "settings": {
                "vnext": [
                    {
                        "port": 443,
                        "users": [
                            {
                                "alterId": 0,
                                "level": 0,
                                "id": "****",
                                "security": "auto"
                            }
                        ],
                        "address": "1.888888888.uk"
                    }
                ]
            },
            "protocol": "vmess",
            "streamSettings": {
                "security": "tls",
                "network": "ws",
                "tlsSettings": {
                    "serverName": "1.888888888.uk",
                    "allowInsecure": true,
                    "fingerprint": "chrome"
                },
                "wsSettings": {
                    "headers": {
                        "host": "1.888888888.uk"
                    },
                    "path": "/ZIq0394bkpr7Dj82"
                }
            }
        },
        {
            "settings": {
                "userLevel": 0,
                "domainStrategy": "UseIP"
            },
            "tag": "direct",
            "protocol": "freedom"
        },
        {
            "protocol": "blackhole",
            "settings": {
                "response": {
                    "type": "none"
                }
            },
            "tag": "block"
        }
    ],
    "dns": {},
    "routing": {
        "settings": {
            "domainStrategy": "AsIs",
            "rules": []
        }
    }
}
```

# 开机自启

```
cat ~/Library/LaunchAgents/uk.888888888.0.plist
```

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
   <key>Label</key>
   <string>uk.888888888.0</string>
   <key>ProgramArguments</key>
   <array>
      <string>/Users/dongpo.li/Software/v2ray-macos-arm64-v8a/v2ray</string>
      <string>run</string>
      <string>-c</string>
      <string>/Users/dongpo.li/Software/v2ray-macos-arm64-v8a/config.json</string>
   </array>
   <key>RunAtLoad</key>
   <true/>
</dict>
</plist>
```

# 重启本地服务
``` bash
#!bash

#################
# ./change.sh 0
#################


x=$1

sed 's/0.888888888.uk/'"$x"'.888888888.uk/g' config.json.tpl > config.json

launchctl unload -w ~/Library/LaunchAgents/uk.888888888.0.plist
launchctl load -w ~/Library/LaunchAgents/uk.888888888.0.plist
```
