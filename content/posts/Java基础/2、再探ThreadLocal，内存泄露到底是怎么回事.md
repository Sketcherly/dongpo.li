---
title: "再探ThreadLocal，内存泄露到底是怎么回事"
date: 2025-05-08T14:20:40+08:00
draft: false
summary: '又一次背八股，又是ThreadLocal'
---

# 背景
刷八股文，并发编程绕不开的问题就是ThreadLocal，ThreadLocal是什么以及使用场景不在本文讨论范围，网上已经很多了。这次来盘一盘内存泄露。

# ThreadLocal用法
不知道别人是怎么使用的，我平时使用ThreadLocal的时候就是定义一个ThreadLocal类型的常量，然后在需要的地方导入。下边是示例代码
``` Java
public class Main {

    /**
     * 这里是模拟一个常量类,实际使用的时候它通常在一个专门的包里或者在utils包里
     */
    public static class Constant {

        /**
         * 假设这是一个存当前请求用户的用户名的ThreadLocal
         * 请求到达服务端之后,拦截器拦截每个请求,然后从请求中获取Token
         * 然后解析Token,获取当前用户的用户名存在这里,后续可以直接从这里拿而不用将用户名作为每个方法的参数到处传
         */
        private static final ThreadLocal<String> USERNAME_THREAD_LOCAL = new ThreadLocal<>();

    }

    public static void main(String[] args) {

        // 这个线程模拟一个用户请求
        new Thread() {
            @Override
            public void run() {
                // 这里模拟拦截器处理Token后将解析到的用户名,通常这个过程在拦截器或者AOP的切面中处理
                Constant.USERNAME_THREAD_LOCAL.set("张三");

                try {
                    printUsername();
                } finally {
                    // 使用完之后要清理
                    Constant.USERNAME_THREAD_LOCAL.remove();
                }

            }

            private void printUsername() {
                String username = Constant.USERNAME_THREAD_LOCAL.get();
                System.out.println("你好: " + username);
            }
        }.start();

        // 这个线程模拟另一个用户请求
        new Thread() {
            @Override
            public void run() {
                // 这里模拟拦截器处理Token后将解析到的用户名
                Constant.USERNAME_THREAD_LOCAL.set("李四");

                try {
                    printUsername();
                } finally {
                    // 使用完之后要清理
                    Constant.USERNAME_THREAD_LOCAL.remove();
                }
            }

            private void printUsername() {
                String username = Constant.USERNAME_THREAD_LOCAL.get();
                System.out.println("你好: " + username);
            }
        }.start();


    }


}

```

# 内存泄露

维基百科的定义，感觉还是比较贴切的。
> 内存泄漏（英语：memory leak）是计算机科学中的一种资源泄漏，主因是计算机程序的记忆体管理失当[1]，因而失去对一段已分配内存空间的控制，程序继续占用已不再使用的内存空间，或是记忆体所储存之物件无法透过执行程式码而存取，令内存资源空耗[2]。

其中有个重点，`令内存资源空耗`。

关于ThreadLocal导致的内存泄露，网上大多是这种意见。
以下是引用的别人的文章内容。
```
ThreadLocal 强引用 -> ThreadLocal 对象。
Thread 强引用 -> ThreadLocalMap。
ThreadLocalMap[i] 强引用了 -> Entry。
Entry.key 弱引用 -> ThreadLocal 对象。
Entry.value 强引用 -> 线程的局部变量对象。

ThreadLocal 内存泄露是怎么回事？
ThreadLocalMap 的 Key 是 弱引用，但 Value 是强引用。

如果一个线程一直在运行，并且 value 一直指向某个强引用对象，那么这个对象就不会被回收，从而导致内存泄漏。
```

## 问题1
此时的问题是，我们定义USERNAME_THREAD_LOCAL的时候是static的，这是个强的不能再强的引用，有它在那个弱引用有没有无所谓，GC是不会收集它的。

## 问题2
网上还有说这种内存泄露会导致OOM的说法。大概说法是，Thread在没有退出的时候是不会释放的，如果此时Thread在线程池里的时候，就有可能导致内存泄露。  

此时的问题是，通常线程池都是有线程数限制的，相关可以参见线程池相关的八股文。这时候我们通常讨论的是线程池队列过大倒是的OOM，几个线程而已，只要不是存的超大对象，是不可能导致OOM的。

# 问题总结
总结来说就是：不当的ThreadLocal使用会导致内存泄露，所以在使用ThreadLocal的时候时候，记得用完要清理（就是实例代码里finally块里的代码），一般到这里就结束了。

此时的疑问是，如果不清理会导致内存泄露吗？  
首先我们假设不清理（主打一个反骨）。  
我们之前说，通常在使用的时候，我们会在拦截器里设置一个值，在其他地方直接获取。而我们设置的时候，会覆盖之前的值，及时上次使用完没有清理，这个线程在下次使用的时候还是要设置，覆盖之前的值，在用完到下次使用的时候，这个值是不会被清理的，但是还是那句话，一个线程对应一个对象而已，怎么看也和OOM没啥关系，线程池里的线程又都是高频使用的，这个对象会频繁覆盖，说是内存泄露也有点勉强（当然如果线程是线程池里的核心线程并且后续也没有相同的请求的话，这块内存确实用不到了但是还占着，算是泄露吧，但是一个对象的空间占用，也不配出现在八股文里了）。

在不清理的基础上我们再假设拦截器里不覆盖，那就不是内存的问题了，程序会表现异常的，此时一般是BUG。

此时再看，用finally作为内存泄露的解就很有问题了。能解决问题，但不是根本原因。


## 探索
带着上边这两个问题，我们来探究到底会不会内存泄露。答案还是会的。就看什么场景下使用会了。

从ThreadLocal的原理看，它的本质是每个线程实例持有一个ThreadLocalMap，在忽略细枝末节的情况下，可以认为他是个`HashMap<ThreadLocal, Object>`。

threadLocal.get()的时候，先找到当前线程，再通过getMap获取到一个类似HashMap的数据结构，再根据用ThreadLocal实例作为key从刚才的Map中找对应的值。

这么看的话，ThreadLocal持有一个`Map<Thread, Object>`也不是不行啊。只是不同的外层而已。

说回来内存泄露，上边的数据结构中，一个Thread对应一个ThreadLocalMap，所以这里是不可能内存泄露的，那一定是发生在ThreadLocalMap里了。

ThreadLocalMap是用ThreadLocal作为key的，如果它变了，那就没有办法get对应的值了，此时如果变之前没有清理的话，内存泄露就发生了。

实例代码
``` Java
public class Main {

    public static void main(String[] args) {

        // 这个线程模拟一个用户请求
        new Thread() {
            @Override
            public void run() {
                // 用for循环模拟冲从线程池多次取出来同一个线程
                for (int i = 0; i < 10; i++) {
                    ThreadLocal<String> threadLocal = new ThreadLocal<>();
                    threadLocal.set("张三" + i);
                    try {
                        printUsername(threadLocal);
                    } finally {
                    }

                }

            }

            private void printUsername(ThreadLocal<String> threadLocal) {
                String username = threadLocal.get();
                System.out.println("你好: " + username);
            }
        }.start();




    }


}

```

![OCpPLY](https://cdn.dongpo.li/uPic/OCpPLY.png)

从控制台上可以看到此时get()到的值是张三9，但是Thread持有的ThreadLocalMap threadLocals的size已经是10了，此时就是内存泄露了。我们假设一个服务月活1亿，线程池有100个核心线程，极端情况下这100个核心线程都处理过每个用户的请求，此时有100*1亿个对象存在内存里而且无法回收，此时虽然其中的ThreadLocal因为是局部变量并且是弱引用，肯定被回收了，但是值是强引用是不能被GC的，此时程序大概率会OOM了。

当然以上是中假设，因为ThreadLocal就是用来避免作为方法参数传递的，所以以上代码除非是纯新手，否则一般是不会出现的。

但是另一种情况，如果定义全局ThreadLocal的时候没有指定final，并且开发人员有手动回收内存的习惯的话，是有可能掉在一个坑里的。

``` Java
public class Main {

    public static ThreadLocal<String> USERNAME_THREAD_LOCAL;

    public static void main(String[] args) {

        // 这个线程模拟一个用户请求
        new Thread() {
            @Override
            public void run() {
                // 用for循环模拟冲从线程池多次取出来同一个线程
                for (int i = 0; i < 10; i++) {
                    // 注意这里和下边的finally块和之前的区别
                    USERNAME_THREAD_LOCAL = new ThreadLocal<>();
                    USERNAME_THREAD_LOCAL.set("张三" + i);
                    try {
                        printUsername();
                    } finally {
                        USERNAME_THREAD_LOCAL = null;
                    }

                }

            }

            private void printUsername() {
                String username = USERNAME_THREAD_LOCAL.get();
                System.out.println("你好: " + username);
            }
        }.start();




    }


}
```

# 总结
所以综上，在常规的使用的时候，ThreadLocalMap里的弱引用没有什么用，在非常规使用的时候，弱引用只能缓解内存泄露（内存泄露的时候Entry里的key是可以回收的，但是value不能回收，所以仅仅是缓解）



