---
title: "99、1-自建梯子(vmess-tcp-tls).md"
date: 2024-03-21T11:46:08+08:00
draft: false
summary: '一篇自己撸各种配置搭建梯子的笔记文章'
---

# 开始之前



# 安装依赖软件
目前已知的依赖，已安装的请忽略
```
vim /etc/ssh/sshd_config
# 搜索 /Client 将 ClientAliveInterval 0前边的注释去掉并且改为 ClientAliveInterval 60
systemctl restart sshd
apt install -y vim curl
```

# 安装配置Nginx

## 安装
```
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

## 配置
先做个伪装网站

配置文件
```
cat /etc/nginx/conf.d/0.888888888.uk.conf
```

``` conf
server {
    listen 80;
    server_name *.888888888.uk;
    root /var/www/html;
    autoindex on; # 开启目录浏览功能；
    autoindex_exact_size off; # 关闭详细文件大小统计，让文件大小显示MB，GB单位，默认为b；
    autoindex_localtime on; # 开启以服务器本地时区显示文件修改日期！
}
```
```
systemctl restart nginx
cd /var/www/html
rm -f index.nginx-debian.html
dd if=/dev/zero of=100MB.tar.gz count=1 bs=100M
dd if=/dev/zero of=500MB.tar.gz count=5 bs=100M
dd if=/dev/zero of=1000MB.tar.gz count=10 bs=100M
```

# 安装配置V2Ray

安装脚本官方项目
```
https://github.com/v2fly/fhs-install-v2ray

https://xtrojan.pro/bgfw/v2ray/v2ray-traffic-mask.html
```

```
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-dat-release.sh)
```

<!-- 
curl 'https://dongpo.li/vmess-server-config.json' -o /usr/local/etc/v2ray/config.json
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
    "inbounds": [
        {
            "protocol": "vmess",
            "listen": "127.0.0.1",
            "port": 12345,
            "settings": {
                "clients": [
                    {
                        "id": "****"
                    }
                ]
            },
            "streamSettings": {
                "network": "tcp"
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom"
        }
    ]
}
```

下边是一个含有落地机的配置。落地机的部署方式更简单，因为不需要伪装，所以不需要haproxy，nginx，当然也不需要tls证书，只需要安装v2ray就可以了，配置也基本一样，只是需要注意，监听的ip不是127.0.0.1而是0.0.0.0

> 注意落地机需要监听0.0.0.0

```
{
    "log": {
        "loglevel": "warning",
        "access": "/var/log/v2ray/access.log",
        "error": "/var/log/v2ray/error.log"
    },
    "inbounds": [
        {
            "protocol": "vmess",
            "listen": "127.0.0.1",
            "port": 12345,
            "settings": {
                "clients": [
                    {
                        "id": "****"
                    }
                ]
            },
            "streamSettings": {
                "network": "tcp"
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "vmess",
            "settings": {
                "vnext": [
                    {
                        "address": "*.*.*.*",
                        "port": 12345,
                        "users": [
                            {
                                "id": "****(落地机的id，可以跟入口的不一样，具体看落地机配置)"
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```

下边这个配置厉害了，是可以根据id来区分是走中转还是走直连的
```
{
    "log": {
        "loglevel": "warning",
        "access": "/var/log/v2ray/access.log",
        "error": "/var/log/v2ray/error.log"
    },
    "inbounds": [
        {
            "protocol": "vmess",
            "listen": "127.0.0.1",
            "port": 12345,
            "settings": {
                "clients": [
                    {
                        "email": "1@123.com",
                        "id": "id1"
                    },
                    {
                        "email": "2@123.com",
                        "id": "id2"
                    }
                ]
            },
            "streamSettings": {
                "network": "tcp"
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "tag": "direct"
        },
        {
            "protocol": "vmess",
            "settings": {
                "vnext": [
                    {
                        "address": "落地机ip",
                        "port": 12345,
                        "users": [
                            {
                                "id": "id3"
                            }
                        ]
                    }
                ]
            },
            "tag": "transit"
        }
    ],
    "routing": {
        "rules": [
            {
                "type": "field",
                "user": [
                    "1@123.com"
                ],
                "outboundTag": "direct"
            },
            {
                "type": "field",
                "user": [
                    "2@123.com"
                ],
                "outboundTag": "transit"
            }
        ]
    }
}
```
核心思路是每个id账号可以绑定一个email，路由里根据id区分用户，不同id走不通的出口  
上边配置只需要改四处  
1、id1 一个用户id  
2、id2 另一个用户id 和1区分不同用户  
3、落地机ip 落地机的实际ip  
3、id3 这个要看落地机的id，和落地机的id一样  

这样客户端可以根据id每个入口机器添加两个节点，选择不同节点就可以手动选择是直连还是中转。
一般来说我们都选择中转，因为入口机器的ip通常不太好，需要一个干净点的ip作为出口ip。
添加一个直连选择是为了可以在节点出问题的时候快速判断是入口机的问题还是落地机的问题。
还有落地如果是家宽的话，通常会比较贵所以一选择合租，或者买共享的家宽节点，所以通常更容易出问题，出了问题算是有个备用方案。因为落地通常只有一个，如果只有中转的话，落地出问题就直接失联了。


```
systemctl enable v2ray
systemctl restart v2ray
```

## 准备Tls证书
```
# 文件在/etc/haproxy/888888888.uk.pem
acme.sh --deploy -d 888888888.uk --deploy-hook haproxy
scp -P 123456 /etc/haproxy/888888888.uk.pem root@4.888888888.uk:/etc/haproxy/ssl/
```


## 安装HaProxy

``` shell
apt install -y haproxy
cd /etc/haproxy
mkdir ssl
cp -rp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bak
vim /etc/haproxy/haproxy.cfg
```

```
global
	log /dev/log	local0
	log /dev/log	local1 notice
	chroot /var/lib/haproxy
	stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
	stats timeout 30s
	user haproxy
	group haproxy
	daemon

	# Default SSL material locations
	ca-base /etc/ssl/certs
	crt-base /etc/ssl/private

	# See: https://ssl-config.mozilla.org/#server=haproxy&server-version=2.0.3&config=intermediate
        ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
        ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
        ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets

defaults
	log	global
	mode	tcp
	option	httplog
	option	dontlognull
        timeout connect 5000
        timeout client  50000
        timeout server  50000
	errorfile 400 /etc/haproxy/errors/400.http
	errorfile 403 /etc/haproxy/errors/403.http
	errorfile 408 /etc/haproxy/errors/408.http
	errorfile 500 /etc/haproxy/errors/500.http
	errorfile 502 /etc/haproxy/errors/502.http
	errorfile 503 /etc/haproxy/errors/503.http
	errorfile 504 /etc/haproxy/errors/504.http

frontend tls-in
    # 监听 443 tls，tfo 根据自身情况决定是否开启，证书放置于 /etc/ssl/private/example.com.pem
    bind *:443 tfo ssl crt /etc/haproxy/ssl/888888888.uk.pem
    tcp-request inspect-delay 5s
    tcp-request content accept if HTTP
    # 将 HTTP 流量发给 web 后端
    use_backend web if HTTP
    # 将其他流量发给 vmess 后端
    default_backend vmess

backend web
    server server1 127.0.0.1:80

backend vmess
    server server1 127.0.0.1:12345
```
以上配置文件重点是 frontend tls-in、backend web、backend vmess
还有defaults>mode>tcp


```
systemctl enable haproxy
systemctl restart haproxy
```


配置网络优先使用ip4
```
vim /etc/gai.conf
# 复制 #precedence ::ffff:0:0/96 100 到一个新行并且把前边的注释去掉
# 测试使用
ping www.google.com
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
security：none

传输配置
选择网络：tcp
type：none



```

# V2RayU
```
{
    "log": {
        "error": "",
        "access": "",
        "loglevel": "info"
    },
    "inbounds": [
        {
            "listen": "127.0.0.1",
            "settings": {
                "auth": "noauth",
                "udp": false
            },
            "port": "1080",
            "protocol": "socks"
        },
        {
            "listen": "127.0.0.1",
            "port": "1087",
            "settings": {
                "timeout": 360
            },
            "protocol": "http"
        }
    ],
    "outbounds": [
        {
            "settings": {
                "vnext": [
                    {
                        "port": 443,
                        "address": "0.888888888.uk",
                        "users": [
                            {
                                "level": 0,
                                "id": "****",
                                "alterId": 0,
                                "security": "none"
                            }
                        ]
                    }
                ]
            },
            "streamSettings": {
                "security": "tls",
                "tlsSettings": {
                    "fingerprint": "chrome",
                    "serverName": "",
                    "allowInsecure": true
                },
                "tcpSettings": {
                    "header": {
                        "type": "none"
                    }
                },
                "network": "tcp"
            },
            "tag": "proxy",
            "mux": {
                "concurrency": 8,
                "enabled": false
            },
            "protocol": "vmess"
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
            "tag": "block",
            "settings": {
                "response": {
                    "type": "none"
                }
            }
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
            "listen": "127.0.0.1",
            "settings": {
                "auth": "noauth",
                "udp": false
            },
            "port": "1080",
            "protocol": "socks"
        },
        {
            "listen": "127.0.0.1",
            "port": "1087",
            "settings": {
                "timeout": 360
            },
            "protocol": "http"
        }
    ],
    "outbounds": [
        {
            "settings": {
                "vnext": [
                    {
                        "port": 443,
                        "address": "0.888888888.uk",
                        "users": [
                            {
                                "level": 0,
                                "id": "****",
                                "alterId": 0,
                                "security": "none"
                            }
                        ]
                    }
                ]
            },
            "streamSettings": {
                "security": "tls",
                "tlsSettings": {
                    "fingerprint": "chrome",
                    "serverName": "",
                    "allowInsecure": true
                },
                "tcpSettings": {
                    "header": {
                        "type": "none"
                    }
                },
                "network": "tcp"
            },
            "tag": "proxy",
            "mux": {
                "concurrency": 8,
                "enabled": false
            },
            "protocol": "vmess"
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
            "tag": "block",
            "settings": {
                "response": {
                    "type": "none"
                }
            }
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
