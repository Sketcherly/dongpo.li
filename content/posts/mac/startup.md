---
title: "Mac开荒"
date: 2024-01-05T11:19:35+08:00
draft: false
summary: 'Mac新装完系统，需要装软件，各软件之间有依赖关系，先记录最初始的软件按住那个流程，后续就没有先后了，随便吧。'
---


# 挂梯子
手机连上WiFi，查看IP，确认梯子监听的端口，然后执行命令，其中的IP和端口改成手机的
```
export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897 all_proxy=socks5://127.0.0.1:7897
```


# Homebrew
挂上梯子就能开始安装brew命令了，因为软件包大多是它管理的。  
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
这个命令执行时间应该会很长，中间输一次密码就该干嘛干嘛去吧。


# AppStore
因为AppStore的账号密码不常用，所以经常忘记，所以也记在了Joplin笔记里，但是此时Joplin账号密码还在微信，我们登AppStore就是为了装微信的，死循环了。  
所以AppStore的账号密码在微信收藏里也有一份，应该是和Joplin的同步账号在一起的，唯一的麻烦是设置的是16位随机字符，输起来比较麻烦。  
家里服务器上开了个Nginx，有个文件存的密码，只有密码，用来复制，主要是用来增加便利的，不是强依赖。执行以下命令获取(或者直接打开浏览器)。
```
curl 'http://192.168.1.202/index.txt'
```


# Joplin
此时就可以安装Joplin了，因为目前所有的账号密码都存在这。  
安装完之后需要先同步之前的笔记，同步需要的账号密码，笔记的解密密码都存在微信收藏里。

# 同步笔记
登上微信之后账号密码就有了，此时就可以配置Joplin同步，获取笔记了。同步之后所有账号密码就都有了。


# 浏览器
装个浏览器吧，马上要用了。


# 梯子订阅链接
上Github获取最新的不需要梯子的域名，此时打开github应该还是比较慢的。


# 梯子
此时梯子网站也打开了，看教程装哪个软件，安装配置。


# 安装输入法

```
brew install --cask squirrel
cd ~/Library/Rime && touch default.custom.yaml
cd ~/Software && git clone --depth 1 https://github.com/rime/plum.git
cd plum && ./rime-install iDvel/rime-ice:others/recipes/full
```

```
1. 打开 Mac 活动监视器，选中程序，点击上方···里取样进程
2. 找到Identifier后面的字段即为程序标识符。
com.jetbrains.intellij.ce
```

```
patch:
  menu/page_size: 7
```
