---
title: "6、直通硬盘和Raid1"
date: 2023-08-01T16:32:08+08:00
draft: false
---

# 


## 直通硬盘


``` shell
# 查看硬盘的id
ls /dev/disk/by-id
qm set 100 -scsi1 /dev/disk/by-id/ata-WDC_WD42PURU-64C4CY0_WD-WXE2A23MPV30
qm set 100 -scsi2 /dev/disk/by-id/ata-WDC_WD42PURU-64C4CY0_WD-WXE2A23MPA7P
```

## 新硬盘组Raid1

gdisk /dev/sdb
输入n  一路回车

mdadm -Cv /dev/md0 -n 2 -l 1 /dev/sdb /dev/sdc


mdadm -D /dev/md0

mdadm --detail --scan >> /etc/mdadm/mdadm.conf
reboot


## 重装系统恢复Raid1
apt install mdadm


-- 先尝试这个
mdadm --assemble /dev/md0 /dev/sdb /dev/sdc

-- 不行的话再尝试这个
mdadm --create /dev/md0 --assume-clean --level=1 --verbose --raid-devices=2 /dev/sdb /dev/sdc


mdadm --detail --scan >> /etc/mdadm/mdadm.conf
update-initramfs -u
reboot


# 参考资料
https://www.dreamxu.com/debian-create-software-raid-one-arrays/
