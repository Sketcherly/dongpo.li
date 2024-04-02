---
title: "7、部署NFS服务"
date: 2023-08-01T18:32:08+08:00
draft: false
---

# 安装

``` bash
apt install nfs-kernel-server
```


# 配置共享目录
``` bash
vim /etc/exports
```

``` text
/data  192.168.1.0/24(rw,sync,no_root_squash,no_subtree_check)
```

# 生效配置
``` bash
exportfs -r
```

# 启动
``` bash
systemctl start nfs-kernel-server
```

# 配置开机自启
``` bash
systemctl enable nfs-kernel-server
systemctl start nfs-kernel-server
```

# 客户端安装
``` bash
apt-get install nfs-common
```

# 创建目录并挂载
``` bash
mkdir /data
mount 192.168.1.201:/data /data
```

# 开机自动挂载
``` bash
vim /etc/fstab
```

``` text
192.168.1.201:/data /data nfs4 rw,nosuid 0 0
```

