---
title: "Mac配置开发环境-Javaer"
date: 2019-04-28T11:19:35+08:00
draft: false
summary: ' '
---


# 安装软件

## brew
Mac必装，没啥好说的，安装教程参见[官网](https://brew.sh)  
安装完成之后需要安装brew-cask，用来装一些非开源的软件。  
执行命令
```
brew install brew-cask-completion
```  
Cask安装指定版本需要安装一个tap，否则无法制定安装的Java版本
``` shell
brew tap caskroom/versions
```

## 安装git
安装命令
``` shell
brew install git
```

## 安装iterm2
Mac自带的终端模拟器和之前的一些使用习惯不太一样，好多快捷键不支持  
安装命令
``` shell
brew cask install iterm2
```

## Java
安装命令
``` shell
brew cask install java8
```
~~开发用Java8，本来是要装Java11的，但是装完之后发现没有@Resource注解编译失败，原因暂时未知，时间有限，暂不深究~~

Java11开始彻底移除了Javaee,所以一些包已经无法使用了,如@Resource注解

附Java12安装方式(安装最新版的OracleJDK,install java目前安装的OpenJDK)
``` shell
brew cask install oracle-jdk
```

## Idea
Java开发神器，穷人家的孩子安装社区版  
安装命令
``` shell
brew cask install intellij-idea-ce
```

## 其他软件
首次配置环境需要安装的软件还是挺多的，不一一列了，软件名就见下边吧，非Cask就执行`brew install 软件名`，Cask软件就执行`brew cask install 软件名`。
### 非Cask
- openconnect 没找到AnyConnect，装openconnect代替
- redis
- tree
- hugo


### 其他Cask软件
- visual-studio-code 文本编辑器
- intellij-idea-ce 
- onedrive 
- firefox
- wpsoffice
- dbeaver-community 
- google-chrome
