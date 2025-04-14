---
title: "12、bitwarden服务安装"
date: 2025-04-11T17:52:57+08:00
draft: false
summary: '用了一段时间的Vaultwarden，感觉还不错，但是毕竟是三方，还是不太放心，所以尝试一下官方的服务'
---

# 背景

Vaultwarden用了一段时间了，体验还是不错的，已经保存了不少密码了，但是Vaultwarden毕竟是三方开发的，还是有些担忧，所以尝试一下官方的代码部署。


# 准备
1、先准备个虚拟机，因为是一个比较重要的服务，所以不和其他的掺在一起了，求稳。官方提供最小配置：1C2G12G

# 安装docker
docker的安装文档每次找起来都很麻烦，所以这次干脆留一个吧
```
https://docs.docker.com/engine/install/debian/
```

docker安装现在要挂代理了，所以贴个样例在这，实际的安装命令还是在官方安装文档里找
```
sudo apt-get -o Acquire::https::proxy="http://192.168.1.89:1087/" install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```
alias apt='apt -o Acquire::https::proxy="http://192.168.1.89:1087/"'
```


# 安装bitwarden

``` bash
# 不设密码，一路回车，反正也不开外网登录
sudo adduser bitwarden
# 刚就没有设置密码，现在也不改，所以这步不执行
sudo passwd bitwarden
# 装上docker就有了所以一不需要执行
sudo groupadd docker
sudo usermod -aG docker bitwarden
sudo mkdir /opt/bitwarden
sudo chmod -R 700 /opt/bitwarden
sudo chown -R bitwarden:bitwarden /opt/bitwarden
# 切换用户
su bitwarden
cd
# 挂代理
export http_proxy=http://192.168.1.89:1087;export https_proxy=http://192.168.1.89:1087;export ALL_PROXY=socks5://192.168.1.89:1080
curl -Lso bitwarden.sh "https://func.bitwarden.com/api/dl/?app=self-host&platform=linux" && chmod 700 bitwarden.sh

./bitwarden.sh install
```

<!-- 
Installation ID:
eda8273c-7b4d-4a69-9a7f-b2bc00c12ead

Installation Key:
XJaHSy741kUVVcsT1Yn0
-->

按步骤填写

```
 _     _ _                         _
| |__ (_) |___      ____ _ _ __ __| | ___ _ __
| '_ \| | __\ \ /\ / / _` | '__/ _` |/ _ \ '_ \
| |_) | | |_ \ V  V / (_| | | | (_| |  __/ | | |
|_.__/|_|\__| \_/\_/ \__,_|_|  \__,_|\___|_| |_|

Open source password management solutions
Copyright 2015-2025, Bitwarden, Inc.
https://bitwarden.com, https://github.com/bitwarden

===================================================

bitwarden.sh version 2025.3.3
Docker version 28.0.4, build b8034c0
Docker Compose version v2.34.0

(!) Enter the domain name for your Bitwarden instance (ex. bitwarden.example.com): bitwarden.sketcherly.xyz

(!) Do you want to use Let's Encrypt to generate a free SSL certificate? (y/n): n

(!) Enter the database name for your Bitwarden instance (ex. vault): vault

2025.3.3: Pulling from bitwarden/setup
Digest: sha256:e9c9f84957c3991e59675a2d940bcc17bcd58e8c8a10cf1cb0cf8c630e259e29
Status: Image is up to date for ghcr.io/bitwarden/setup:2025.3.3
ghcr.io/bitwarden/setup:2025.3.3

(!) Enter your installation id (get at https://bitwarden.com/host): *****

(!) Enter your installation key: *****

(!) Enter your region (US/EU) [US]: US

(!) Do you have a SSL certificate to use? (y/N): n

(!) Do you want to generate a self-signed SSL certificate? (y/N): n

Generating key for IdentityServer.
.+........+....+...+.........+.....+......+.............+......+........+.+......+.........+..+.........+......+...+.+...+...........+....+..+.+.........+...+......+..+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*..+...+...+....+...+...........+.+........+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*..........+.......+......+.........+.........+..+..................+.+.....+......+...............+....+........+.......+...+......+....................+.+........+...+...+....+...+.....+....+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
..+......+...........+.............+.....+....+.....+..................+....+.....+..........+.........+..+.......+........+....+.....+...+.+.........+...+.....+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*...+...+................+.........+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*...+...+...........+....+......+.......................+...+...+.+.....+..................................+.....+.+..................+..+.........+.......+..+.......+.....+.........+.+.........+.................+.........+...+......+....+...+.........+...+.....+.......+......+..+...+...+.+.....+......+.........+.+.....+..........+..+............+.....................+...+.+......+.................+.......+...+..+...+...+..........+...+..+...+....+...............+........+.......+......+.....+.......+.........+.....+......+.......+..................+....................+....+...+...........+..........+..............+.+.....................+...+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-----

!!!!!!!!!! WARNING !!!!!!!!!!
You are not using a SSL certificate. Bitwarden requires HTTPS to operate.
You must front your installation with a HTTPS proxy or the web vault (and
other Bitwarden apps) will not work properly.

Building nginx config.
Building docker environment files.
Building docker environment override files.
Building FIDO U2F app id.
Building docker-compose.yml.

Installation complete

If you need to make additional configuration changes, you can modify
the settings in `./bwdata/config.yml` and then run:
`./bitwarden.sh rebuild` or `./bitwarden.sh update`

Next steps, run:
`./bitwarden.sh start`





Bitwarden is up and running!
===================================================

visit https://bitwarden.sketcherly.xyz
to update, run `./bitwarden.sh updateself` and then `./bitwarden.sh update`



```



# 备份

```


#!/bin/bash

BACKUP_DATE=$(date +%Y-%m-%d)

cd /home/bitwarden/
tar -zcvf ${BACKUP_DATE}.tar.gz bwdata && cp ${BACKUP_DATE}.tar.gz /data/backup/docker/bitwarden/ && rm -rf ${BACKUP_DATE}.tar.gz && find /data/backup/docker/bitwarden/ -mtime +30 -type f | xargs rm -rf

```

# 恢复

1、新建个虚拟机  CPU、内存、硬盘、IP，修改shiq
```
cp /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime
```
2、安装nfs，挂载数据盘  如果是数据盘炸了，从OSS下载数据应该是一样的
3、安装docker
4、安装bitwarden，步骤跟上边差不多
区别1：在切换用户之前先还原备份数据
```
cp /data/backup/docker/bitwarden/xxx.tar.gz /home/bitwarden/
tar -zxvf xxx.tar.gz
```
区别2：安装脚本下载下来之后不需要安装，直接执行start。
5、添加备份脚本
``` bash
# 注意要先切换到root用户，不然怕没有nfs的权限
mkdir scripts
cd scripts/
cp -rp /data/backup/docker/scripts/bitwarden-backup.sh .
crontab -e
# 0 18 * * * bash /root/scripts/bitwarden-backup.sh
```








