---
title: "11、安装immich相册服务"
date: 2024-11-12T10:32:08+08:00
draft: false
---



alist管理文件不错，单数看照片的时候卡卡的，所以需要安装一个照片浏览服务。
论坛转了一圈最后选定了immich，先试用一段时间吧。
<!--more-->


# 背景
alist管理文件不错，单数看照片的时候卡卡的，所以需要安装一个照片浏览服务。
论坛转了一圈最后选定了immich，先试用一段时间吧。

目前只是需要一个预览的服务，因为图片上传的话还是使用alist，同步用的FolderSyncPro（付费的）。


# 开始之前
因为是作为网盘的一部分的，所以决定装在files服务上，和alist放在一起。

因为这台机器只安装了alist，二进制安装的，所以需要先装docker（immich推荐docker-compose安装）。

docker安装比较简单，参照官方文档（https://docs.docker.com/engine/install/debian/）就好了，唯一的问题是docker服务器现在已经在墙外了，需要挂梯子。梯子相关的问题限于篇幅不再这里讨论了，自备知识吧。


核心就是更新、安装软件的时候添加`-o Acquire::socks::proxy="socks5h://192.168.1.88:1080/"`参数，使用样例如下。

```
apt-get -o Acquire::socks::proxy="socks5h://192.168.1.88:1080/" install docker-compose-plugin
```

# 安装immich

> 首先要注意，immich还在积极开发中，所以更新频繁，而且更新会有想下不兼容的情况。

官方推荐使用docker-compose安装，我们听话一点。这里需要注意一点，装好之后是没有准备升级的，所以没有备份，后续升级的时候，直接卸载这个重装一次吧。原因是看到社区说升级会碰到各种问题，也各种不兼容。好在重装也不麻烦，只是配置个账号和一些基础设置，其他都是自动完成的。

官方文档在这里：https://immich.app/docs/install/docker-compose

都是一些命令就可以了，所以就不再这里一一记录了，只说一些需要注意的。

1、资源都是在github上的，所以下载会慢并且可能失败，所以挂梯子。
```
export http_proxy=http://192.168.1.88:1081;export https_proxy=http://192.168.1.88:1081;export ALL_PROXY=socks5://192.168.1.88:1080
```
2、docker-compose.yml中的磁盘挂载配置都删除了。如`- ${UPLOAD_LOCATION}:/usr/src/app/upload`等，暂时不知道是什么目录，但是我们上边说了，不准备升级。
3、需要挂载图片所在的路径到docker内部作为外部图库路径，ro说明是只读，防止immich修改原始的图片，他只是用来看的。
```
  volumes:
    - /data:/data:ro
```
4、docker-compose.yml中的docker.io已经在墙外了，所以换成目前可用的，因为现在可用的可能将来某天就墙了，所以自行寻找可用的代理，最终改成类似这个样子
```
    image: dockerproxy.net/tensorchord/pgvecto-rs:pg14-v0.2.0@sha256:90724186f0a3517cf6914295b5ab410db9ce23190a2d9d0b9dd6463e3fa298f0
    image: dockerproxy.net/library/redis:6.2-alpine@sha256:2ba50e1ac3a0ea17b736ce9db2b0a9f6f8b85d4c27d5f5accc6a416d8f42c6d5
```
5、直接执行 `docker compose up -d` 的时候首次会下载镜像，但是不知道什么原因会失败，所以先手动下载墙外的镜像。命令类似下边。
```
docker pull dockerproxy.net/tensorchord/pgvecto-rs:pg14-v0.2.0
```

# 配置nginx

目标是在家的时候使用内网ip，外出使用穿透机器的外网ip，我们使用两套nginx，一套在frp机器上，一套就在当前这台机器上。

配置如下

``` bash
touch /etc/nginx/conf.d/immich.sketcherly.xyz.conf
```

``` conf
upstream immich.sketcherly.xyz.upstream {
  server localhost:2283     weight=1   max_fails=3 fail_timeout=10s;
}

server {
    listen       443 ssl;
    server_name  immich.sketcherly.xyz;

    #填写证书文件名称
    ssl_certificate /etc/nginx/conf.d/cert/sketcherly.xyz.crt;
    #填写证书私钥文件名称··
    ssl_certificate_key /etc/nginx/conf.d/cert/sketcherly.xyz.key;

    ssl_session_timeout 5m;
    #表示使用的加密套件的类型
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    #表示使用的TLS协议的类型，您需要自行评估是否配置TLSv1.1协议。
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass     http://immich.sketcherly.xyz.upstream/;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
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


```
systemctl restart nginx
```

frp机器上也是同样的操作，然后在域名的dns服务器上添加记录immich.sketcherly.xyz和对应的frp机器ip。内网的dns也添加immich.sketcherly.xyz域名解析到内网ip。

# 配置账号
此时应该就安装好了，需要做一些简单的配置就可以开始了。

访问http://ip:2283，首先会需要设置管理员账号和密码。然后登录。

右上角-》管理-》外部图库-》创建图库-》添加导入路径-》`/data/user1/DCIM/`-》保存-》扫描。
<!-- 右上角-》管理-》设置-》任务设置-》只能搜索并发-》0-》人脸检测并发-》0-》人脸识别并发-》0-》视频转码并发-》0-》保存 -->
右上角-》管理-》任务-》生成缩略图-》缺失  
右上角-》管理-》任务，查看缩略图生成进度，全部生成之后就能在首页看到图片了。  
可以先关闭其他任务，加快缩略图生成的速度  

右上角-》账户设置-》应用设置-》显示原始照片-》打开  
右上角-》账户设置-》功能-》文件夹-》启用-》打开-》侧边栏-》打开  
右上角-》账户设置-》功能-》基于时间的回忆-》关闭


至此安装完毕，我也是第一次使用，有什么问题欢迎讨论。


