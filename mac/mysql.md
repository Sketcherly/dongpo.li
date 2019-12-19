---
title: "MySQL语句收藏"
date: 2019-08-02T11:17:37+08:00
draft: false
---

<!--more-->


# MySQL语句收藏

## 查询数据库占用磁盘空间

```sql
select 
TABLE_SCHEMA, 
concat(truncate(sum(data_length)/1024/1024,2),' MB') as data_size,
concat(truncate(sum(index_length)/1024/1024,2),'MB') as index_size
from information_schema.tables
group by TABLE_SCHEMA
ORDER BY data_size desc;
```


## 查询表占用空间

``` sql
select 
TABLE_NAME, 
concat(truncate(data_length/1024/1024,2),' MB') as data_size,
concat(truncate(index_length/1024/1024,2),' MB') as index_size
from information_schema.tables 
where TABLE_SCHEMA = 'mysql'
group by TABLE_NAME
order by data_length desc;
```