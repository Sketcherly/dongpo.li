---
title: "7、部署NFS服务"
date: 2023-08-01T10:32:08+08:00
draft: true
---

# 安装

apt-get install nfs-common nfs-kernel-server


# 配置共享目录
``` bash
vim /etc/exports
```

``` text
/data  192.168.1.201/24(rw,sync,no_root_squash,no_subtree_check)
```

# 生效配置
exportfs -r

# 启动
``` bash
/etc/init.d/nfs-kernel-server start
```

# 配置开机自启
systemctl enable nfs-kernel-server
systemctl start nfs-kernel-server

# 客户端安装
``` bash
apt-get install nfs-common
```

# 创建目录并挂载
``` bash
mkdir /mnt/slaver.backup
mount 192.168.1.112:/data/slaver.backup /mnt/slaver.backup
```

# 开机自动挂载
``` bash
vim /etc/fstab
```

``` text
192.168.1.112:/data/slaver.backup /mnt/slaver.backup nfs4 rw,nosuid 0 0
```

