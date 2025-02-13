---
title: "搬瓦工GIA当做博客入口"
date: 2024-12-02T02:10:40+08:00
draft: false
summary: '测试多个CDN方案过墙结果都不满意，索性用已有的CN2GIA当做入口，稳定且快，钞能力就是简单。'
---





```
apt update
apt install curl
apt install vim

vim /etc/ssh/sshd_config
# /Client
systemctl restart sshd

apt install nginx
systemctl enable nginx
systemctl start nginx



curl https://get.acme.sh | sh -s email=dongpo.li@hotmail.com
vim .bashrc
# ll && acme.sh=~/.acme.sh/acme.sh

<!-- KMtQJewUgUZWlND7K-RBjBLS5pW3LdhTgoCjWxUa -->
# CF_Token在CF后台-我的个人资料-API令牌-用户API令牌 中添加
export CF_Token="****"
acme.sh --issue -d dongpo.li -d *.dongpo.li --dns dns_cf

cd /etc/nginx/conf.d/
mkdir cert
cd cert/
cd ..
touch www.dongpo.li.conf
vim www.dongpo.li.conf

acme.sh --install-cert -d dongpo.li \
 --key-file       /etc/nginx/conf.d/cert/any.dongpo.li.key  \
 --fullchain-file /etc/nginx/conf.d/cert/any.dongpo.li.crt \
 --reloadcmd     "systemctl restart nginx"

crontab -e
# 检查，一般会自动加
# 0 0 * * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null





```



```
upstream www.dongpo.li.upstream {
  server sketcherly-sand.vercel.app:443     weight=1   max_fails=3 fail_timeout=10s;
}

server {
    listen       443 ssl;
    server_name  www.dongpo.li;
    server_name  dongpo.li;

    #填写证书文件名称
    ssl_certificate /etc/nginx/conf.d/cert/any.dongpo.li.crt;
    #填写证书私钥文件名称··
    ssl_certificate_key /etc/nginx/conf.d/cert/any.dongpo.li.key;

    ssl_session_timeout 5m;
    #表示使用的加密套件的类型
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    #表示使用的TLS协议的类型，您需要自行评估是否配置TLSv1.1协议。
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass     https://www.dongpo.li.upstream/;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host sketcherly-sand.vercel.app;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_max_temp_file_size 0;
        client_max_body_size 1024g;
        proxy_redirect off;
        proxy_read_timeout 240s;
    }
}
```