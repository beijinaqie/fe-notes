[toc]

# OSI七层网络模型

## 概述

| OSI七层模型 | 功能                                                         | 对应的网络协议                                               |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 应用层      | 应用层是网络体系中最高的一层，也是唯一面向用户的一层，也可视为为用户提供常用的应用程序，每个网络应用都对应着不同的协议 | HTTP、TFTP, FTP, NFS, WAIS、SMTP                             |
| 表示层      | 主要负责数据格式的转换，确保一个系统的应用层发送的消息可以被另一个系统的应用层读取，编码转换，数据解析，管理数据的解密和加密，同时也对应用层的协议进行翻译 | Telnet, Rlogin, SNMP, Gopher                                 |
| 会话层      | 负责网络中两节点的建立，在数据传输中维护计算机网络中两台计算机之间的通信连接，并决定何时终止通信 | SMTP, DNS                                                    |
| 传输层      | 是整个网络关键的部分，是实现两个用户进程间端到端的可靠通信，处理数据包的错误等传输问题。是向下通信服务最高层，向上用户功能最底层。即向网络层提供服务，向会话层提供独立于网络层的传送服务和可靠的透明数据传输。 | TCP, UDP                                                     |
| 网络层      | 进行逻辑地址寻址，实现不同网络之间的路径选择，IP就在网络层   | IP, ICMP, ARP, RARP, AKP, UUCP                               |
| 数据链路层  | 物理地址（MAC地址），网络设备的唯一身份标识。建立逻辑连接、进行硬件地址寻址，相邻的两个设备间的互相通信 | FDDI, Ethernet, Arpanet, PDN, SLIP, PPP，STP。HDLC,SDLC,帧中继 |
| 物理层      | 七层模型中的最底层，主要是物理介质传输媒介（网线或者是无线），在不同设备中传输比特，将0/1信号与电信号或者光信号互相转化 | IEEE 802.1A, IEEE 802.2到IEEE 802                            |

数据发送时从上至下封装，收到数据包后从下至上解包。每一层对于上一层来讲是透明的，上层只需要使用下层提供的接口，并不关心下层是如何实现的。

两台计算机进行通信时，必须遵守以下原则：

+ 必须是同一层次进行通信，比如，A 计算机的应用层和 B 计算机的传输层就不能通信，因为它们不在一个层次，数据的拆包会遇到问题。
+ 每一层的功能都必须相同，也就是拥有完全相同的网络模型。如果网络模型都不同，那不就乱套了，谁都不认识谁。
+ 数据只能逐层传输，不能跃层。
+ 每一层可以使用下层提供的服务，并向上层提供服务。

### OSI 和TCP/IP 的对应关系和协议

OSI: open system interconnection 开放式系统互联参考模型

![](https://pic1.zhimg.com/80/v2-2d62ba265be486cb94ab531912aa3b9c_1440w.jpg)

### OSI模型各层的基本作用

![](https://pic2.zhimg.com/80/v2-436927a69a3574532059a78623d3095d_1440w.jpg)

### OSI七层模型之间的关系

![](https://img-blog.csdn.net/2018041112053246?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5NTIxNTU0/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

### 数据包的封装过程

![](http://img.mp.itc.cn/upload/20170719/04ef60e2f35b442ca69b22f28bac6520_th.jpg)

不同的协议层对数据包有不同的称谓，在传输层叫做段（segment），在网络层叫做数据报（datagram），在链路层叫做帧（frame）。数据封装成帧后发到传输介质上，到达目的主机后每层协议再剥掉相应的首部，最后将应用层数据交给应用程序处理。两台计算机在不同的网段中，那么数据从一台计算机到另一台计算机传输过程中要经过一个或多个路由器。

### 数据传输过程

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/22/1706c89b9013236e~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

## 物理层

主要是传输数据，物理层设备，hub(集线器)，中继器

- 中继器： 将信号放大再调整传输，防止网络早期远距离传输的信号衰减。
- HUB：HUB模式下，某主机A向连在同一个HUB的主机B发送bits时，是先将bits发给HUB，然后HUB直接发送给与该HUB相连接的每一个机器； HUB中若有有多个主机想发送bits，那么冲突可能会相当严重。因此后来引入了Ethernet HUB，它有一个所谓的CSMA/CD检测算法， 用来解决HUB的冲突问题。**半双工传输！**

中继器的工作性质参考高压输电

hub集线器相当于广播喇叭，你们村子里在同一个喇叭覆盖下，你在村子里找哪个人，需要到广播站对所有收到广播的人呼喊，所有人都能听到

1. 通过光缆、电缆、无线电波等方式将设备连接起来组网
2. 两个不同局域网(移动、电信)）通信，需要ISP互联网服务供应商的物理连接
3. 传送比特流0和1

## 数据链路层

数据链路层设备，网卡，网桥，交换机

- 网卡：又称NIC卡，用于计算机和局域网的通信。
- 网桥：只有两个口，用于在数据链路层扩展以太网，根据MAC帧的目的地址对收到的帧进行转发和过滤。 含有转发表。它隔离了冲突域，但不隔离广播域。
- 交换机：不太严格的来讲就是多端口的网桥

数据链路层主要作用是作为物理层与网络层的侨接，将这两层进行链接，进行链路管理

## 网络层

- 路由器：连接不同局域网，广域网，在不同网络间转发IP分组。

ip寻址以及路径选择

## 传输层

数据传递给对方，超时和丢包怎么办

## 会话层

建立会话管理会话

## 表示层

进行数据格式化，加密，解密

## 应用层

为应用程序提供网络服务

# HTTP版本

- HTTP的版本

  - 0.9

    1991年

    - 只有GET请求，并且只能传输文本html格式，返回的内容是以ASCII字符流来传输的

  - 1.0

    1996年5月发布

    - 新特性

      - 传输不仅仅限制于文本，视频音频图片等二进制文件也可以传输

      - 在0.9的GET请求基础上增加了POST和HEAD等请求方法

      - 每次请求响应除了要传输的数据之外，还增加了请求头和响应头的信息，用来描述一些信息，还增加了状态码（status code）、多字符集支持、多部分发送（multi-part type）、权限（authorization）、缓存（cache）、内容编码（content encoding）等

      - 增加了长链接(非标准的)，但本质上默认还是短链接，HTTP1.0必须在请求头中增加”Connection： keep-alive才能够支持

    - 局限性

      - 连接无法复用。HTTP 1.0 规定浏览器与服务器只保持短暂的连接，浏览器的每次请求都需要与服务器建立一个TCP连接，服务器完成请求处理后立即断开TCP连接，服务器不跟踪每个客户也不记录过去的请求。如果还要请求其他资源，就必须再新建一个连接。

      - Head-Of-Line Blocking（HOLB，队头阻塞）。HOLB 是指一系列包（package）因为第一个包被阻塞；当页面中需要请求很多资源的时候，HOLB 会导致在达到最大请求数量时，剩余的资源需要等待其它资源请求完成后才能发起请求。这会导致带宽无法被充分利用，以及后续健康请求被阻塞。

  - 1.1

    1999 发布

    - 新特性

      - 带来了真正的长链接，并发请求下，tcp默认不关闭，可以被多个请求复用，不用声明Connection:Keep-alive，因为它是默认的，除非特地设置close去关闭

      - 增加了管道机制（pipeling ），可以多个请求并行发起，增加了并发性，进一步改善了http的效率

        （ps:由于管道机制又会带来一些问题，浏览器默认都是关闭的）

        - 非管道化
          完全串行执行，请求->响应->请求->响应...，后一个请求必须在前一个响应之后发送

        - 管道化
          请求可以并行发出，但是响应必须串行返回。后一个响应必须在前一个响应之后。原因是，没有序号标明顺序，只能串行接收。

      - Content-length字段声明本次回应的数据长度，也就是用来判断例如传输包的大小，但是如果对于动态生成的内容，在传输过程中还不知道内容的大小，在HTTP1.1中引入了一个叫Chunk transfer机制来解决这个问题，服务器将数据分割成任意大小的数据块，每一个数据块发送时会附上上一个数据块的长度，最后使用一个零长度的块作为发送成功的标志，这样就提供了对动态内容的支持

      - 新增了更多的请求方式，如PUT、PATCH、OPTIONS、DELETE等

      - 客户端请求的头信息新增了Host字段，用来指定服务器的域名。

        以前http1.0都是一个公网IP一台服务器一个网站，后来虚拟主机技术的发展一台服务器一个公网IP特么能放成千上万个网站

        - 有疑问，现在咋没了

      - HTTP/1.1支持文件断点续传，RANGE:bytes，HTTP/1.1每次传送文件都是从文件头开始，即0字节处开始。RANGE:bytes=XXXX表示要求服务器从文件XXXX字节处开始传送，断点续传。即返回码是206（Partial Content）

        - [http断点续传原理：http头 Range、Content-Range_lv18092081172的博客-CSDN博客](https://blog.csdn.net/lv18092081172/article/details/51457525)

        - 疑问，既然有这个断点续传，为什么后面又让前端去切片断点续传

      - 新增了24个错误状态响应码

    - 局限性

      - 由于TCP本身的慢启动的特性，虽然加入 keep-alive 可以复用一部分连接，但域名分片（Domain sharding）等情况下仍然需要建立多个 connection，耗费资源，给服务器带来性能压力

      - pipeling 只部分解决了 HOLB。HTTP 1.1 尝试使用 pipeling 来解决队头阻塞问题，即浏览器可以一次性发出多个请求（同个域名、同一条 TCP 链接）。但 pipeling 要求返回是按序的，那么前一个请求如果很耗时（比如处理大图片），那么后面的请求即使服务器已经处理完，仍会等待前面的请求处理完才开始按序返回。

      - 协议开销大。HTTP/1 在使用时，header 里携带的内容过大，在一定程度上增加了传输的成本，并且每次请求 header 基本不怎么变化，尤其在移动端增加用户流量。

  - 2.0

    2015年5月

    - 由来
      - 谷歌公开了自行研发的 SPDY 协议，主要解决 HTTP/1.1 效率不高的问题。这个协议在 Chrome 浏览器上证明 可行以后，就被当作 HTTP/2 的基础，主要特性都在 HTTP/2 之中得到继承

    - 新特性

      - 二进制分帧 HTTP 2.0 会将所有传输的信息分割为更小的消息和帧,并对它们采用二进制格式的编码（HTTP1.1以及之前的报文的头信息必须是文本（ASCII 编码），数据体可以是文本，也可以是二进制。）
        - ![img](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/boxcn2dqalCJoR4M2F5BTiQIWkc?mount_node_token=bmncnSQtraNvS2qaS8W4awr9FDh&mount_point=mindnote_image)

      - 使用了多路复用（一个域名只使用一个TCP长链接，TCP只慢启动一次）的技术，由于使用了二进制分帧，所以每次请求的数据都采用数据流的形式发送接收，响应不必等待前面的响应完成，服务器会直接把所有的数据包带ID传输回来,然后浏览器会根据ID拼接成完整的HTTP请求或响应数据，这样会解决head of line bloacking队头阻塞问题，并且可以同时处理更多的请求（可以说1.1的长链接是半双工通信，有了多路复用之后变成全双工）
        - ![img](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/boxcnOZCBNl7epYo81XFdBq449b?mount_node_token=bmncnSQtraNvS2qaS8W4awr9FDh&mount_point=mindnote_image)

      -  请求头压缩：HTTP 协议不带有状态，每次请求都必须附上所有信息。所以，请求的很多字段都是重复的，比如Cookie和User Agent，一模一样的内容，每次请求都必须附带，这会浪费很多带宽，也影响速度。HTTP/2 对这一点做了优化，引入了头信息压缩机制（header compression）。一方面，头信息使用gzip或compress压缩后再发送；另一方面，客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，生成一个索引号，以后就不发送同样字段了，只发送索引号，这样就提高速度了。

      - 服务端推送 HTTP/2 允许服务器未经新的请求，主动向客户端发送资源，这叫做服务器推送（server push）。

        - https://www.xiaoz.me/archives/13991

        - https://www.ruanyifeng.com/blog/2018/03/http2_server_push.html

    - 局限性

      - HTTP的队头阻塞解决了，那TCP的队头阻塞这么办？
        由于http2.0的多路复用，使得一个TCP连接可能有多个http连接，如果TCP丢包率高还不如使用HTTP1.1的一个TCP发起一个http请求（研究表明如果丢包率超过2%，http2还不如http1.1快）

      - 由于TCP的握手机制，是在太过繁琐，并且2.0增加了TLS，服务器和客户端之前的通信RTT次数增加

  - 3.0
    - 新增了QUIC（Quick UDP Internet Conection）协议,原因是TCP协议相较于UDP协议建立连接时复杂耗时，所以推出QUIC协议，既有TCP的可靠性又保留了UDP的高效性
      - ![img](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/boxcnft8mqXOsx4ixTQhKpNYuQe?mount_node_token=bmncnSQtraNvS2qaS8W4awr9FDh&mount_point=mindnote_image)

  - 参考

    - https://cloud.tencent.com/developer/article/1513007

    - https://cloud.tencent.com/developer/article/1518678

    - https://www.cnblogs.com/mengff/p/12724641.html

    - https://www.infoq.cn/article/uallzq6vu7emxbxdkjex

# HTTP缓存

> http缓存是浏览器的优化技术，可以加快资源获取速度，提升用户体验，减少网络传输，缓解服务端的压力，但是这也产生一个新的问题，那就是资源如何同步，为了使资源能够同步，因此设计了一大堆字段`Cache-Control`，`ETag`，`Last-Modified`在header里面

## 缓存使用的优先级

优先使用强制缓存，如果命中强制缓存，则浏览器即不需要发送请求直接使用已经缓存的数据，如果没有命中则进行下一步缓存，和服务器之间的协商缓存

![](http://zcy-cdn.oss-cn-shanghai.aliyuncs.com/f2e-assets/c3c22890-140e-4cef-9999-068585b6c31c.jpg?x-oss-process=image/quality,Q_75)

## 强制缓存

强制缓存不需要发送请求到服务端，直接读取浏览器本地缓存，http1.0使用的是Expires，http1.1使用Cache-Control

+ Pragma

  Pragma 只有一个属性值，就是 no-cache ，效果和 Cache-Control 中的 no-cache 一致，不使用强缓存，需要与服务器验证缓存是否新鲜，在 3 个头部属性中的优先级最高。

+ Cache-Control(请求头多值使用) 

  + no-cache: 强制向源服务器确认
  + no-store: 不缓存请求或相应的任何内容
  + max-age: 缓存多久

+ Cache-Control(响应头多值使用) 

  + max-age：单位是秒，缓存时间计算的方式是距离发起的时间的秒数，超过间隔的秒数缓存失效
  + no-cache：不使用强制缓存，需要与服务器验证缓存是否新鲜
  + no-store：禁止使用缓存（包括协商缓存），每次都向服务器请求最新的资源
  + private：仅客户端缓存
  + public：客户端、代理服务器(nginx代理)进行缓存
  + must-revalidate：在缓存过期前可以使用，过期后必须向服务器验证

+ Expires

  Expires 的值是一个 HTTP 日期，在浏览器发起请求时，会根据系统时间和 Expires 的值进行比较，如果系统时间超过了 Expires 的值，缓存失效。由于和系统时间进行比较，所以当系统时间和服务器时间不一致的时候，会有缓存有效期不准的问题。Expires 的优先级在是最低的。

## 协商缓存

当浏览器的强缓存失效的时候或者请求头中设置了不走强缓存，并且在请求头中设置了If-Modified-Since 或者 If-None-Match 的时候，会将这两个属性值到服务端去验证是否命中协商缓存，如果命中了协商缓存，会返回 304 状态，加载浏览器缓存，并且响应头会设置 Last-Modified 或者 ETag 属性。ETag优先级较高，原因是Last-Modified的单位是秒，如果存在一秒内资源多次变动，则就可能资源不准确，而ETag每次变动都会生成新的hash，但是生成hash又需要资源，所以根据项目需求使用吧

+ ETag/If-None-Match

  ETag/If-None-Match 的值是一串 hash 码，代表的是一个资源的标识符，当服务端的文件变化的时候，它的 hash码会随之改变，通过请求头中的 If-None-Match 和当前文件的 hash 值进行比较，如果相等则表示命中协商缓存。ETag 又有强弱校验之分，如果 hash 码是以 "W/" 开头的一串字符串，说明此时协商缓存的校验是弱校验的，只有服务器上的文件差异（根据 ETag 计算方式来决定）达到能够触发 hash 值后缀变化的时候，才会真正地请求资源，否则返回 304 并加载浏览器缓存。

+ Last-Modified/If-Modified-Since

  Last-Modified/If-Modified-Since 的值代表的是文件的最后修改时间，第一次请求服务端会把资源的最后修改时间放到 Last-Modified 响应头中，第二次发起请求的时候，请求头会带上上一次响应头中的 Last-Modified 的时间，并放到 If-Modified-Since 请求头属性中，服务端根据文件最后一次修改时间和 If-Modified-Since 的值进行比较，如果相等，返回 304 ，并加载浏览器缓存。

## 刷新获取资源

+ 回车

  直接读取

+ f5

  浏览器会在请求头带上If-Modified-Since

+ ctrl + f5

  去除缓存，在请求资源

# HTTPS

HTTP采用明文传输，中间人可以获取到明文数据（从而实现对数据的篡改）。这时候HTTPS 就登场了！
HTTPS 是什么呢？HTTPS = HTTP + SSL/TLS，SSL 安全套接层(Secure Sockets Layer) 发展到
v3 时改名为TLS 传输层安全(Transport Layer Security)，主要的目的是提供数据的完整性和保密性。

对称和非对称都有缺陷

解决方案 Ca安全证书

# http版本



HTTP的版本
    0.9
    ｜ 1991年
        只有GET请求，并且只能传输文本html格式，返回的内容是以ASCII字符流来传输的
    1.0
    ｜ 1996年5月发布
        新特性
            传输不仅仅限制于文本，视频音频图片等二进制文件也可以传输
            在0.9的GET请求基础上增加了POST和HEAD等请求方法
            每次请求响应除了要传输的数据之外，还增加了请求头和响应头的信息，用来描述一些信息，还增加了状态码（status code）、多字符集支持、多部分发送（multi-part type）、权限（authorization）、缓存（cache）、内容编码（content encoding）等
            增加了长链接(非标准的)，但本质上默认还是短链接，HTTP1.0必须在请求头中增加”Connection： keep-alive才能够支持
        局限性
            连接无法复用。HTTP 1.0 规定浏览器与服务器只保持短暂的连接，浏览器的每次请求都需要与服务器建立一个TCP连接，服务器完成请求处理后立即断开TCP连接，服务器不跟踪每个客户也不记录过去的请求。如果还要请求其他资源，就必须再新建一个连接。
            Head-Of-Line Blocking（HOLB，队头阻塞）。HOLB 是指一系列包（package）因为第一个包被阻塞；当页面中需要请求很多资源的时候，HOLB 会导致在达到最大请求数量时，剩余的资源需要等待其它资源请求完成后才能发起请求。这会导致带宽无法被充分利用，以及后续健康请求被阻塞。
    1.1
    ｜ 1999 发布
        新特性
            带来了真正的长链接，并发请求下，tcp默认不关闭，可以被多个请求复用，不用声明Connection:Keep-alive，因为它是默认的，除非特地设置close去关闭
            增加了管道机制（pipeling ），可以多个请求并行发起，增加了并发性，进一步改善了http的效率
            ｜ （ps:由于管道机制又会带来一些问题，浏览器默认都是关闭的）
                非管道化
                ｜ 完全串行执行，请求->响应->请求->响应...，后一个请求必须在前一个响应之后发送
                管道化
                ｜ 请求可以并行发出，但是响应必须串行返回。后一个响应必须在前一个响应之后。原因是，没有序号标明顺序，只能串行接收。
            Content-length字段声明本次回应的数据长度，也就是用来判断例如传输包的大小，但是如果对于动态生成的内容，在传输过程中还不知道内容的大小，在HTTP1.1中引入了一个叫Chunk transfer机制来解决这个问题，服务器将数据分割成任意大小的数据块，每一个数据块发送时会附上上一个数据块的长度，最后使用一个零长度的块作为发送成功的标志，这样就提供了对动态内容的支持
            新增了更多的请求方式，如PUT、PATCH、OPTIONS、DELETE等
            客户端请求的头信息新增了Host字段，用来指定服务器的域名。
            ｜ 以前http1.0都是一个公网IP一台服务器一个网站，后来虚拟主机技术的发展一台服务器一个公网IP特么能放成千上万个网站
                有疑问，现在咋没了
            HTTP/1.1支持文件断点续传，RANGE:bytes，HTTP/1.1每次传送文件都是从文件头开始，即0字节处开始。RANGE:bytes=XXXX表示要求服务器从文件XXXX字节处开始传送，断点续传。即返回码是206（Partial Content）
                http断点续传原理：http头 Range、Content-Range_lv18092081172的博客-CSDN博客
                疑问，既然有这个断点续传，为什么后面又让前端去切片断点续传
            新增了24个错误状态响应码
        局限性
            由于TCP本身的慢启动的特性，虽然加入 keep-alive 可以复用一部分连接，但域名分片（Domain sharding）等情况下仍然需要建立多个 connection，耗费资源，给服务器带来性能压力
            pipeling 只部分解决了 HOLB。HTTP 1.1 尝试使用 pipeling 来解决队头阻塞问题，即浏览器可以一次性发出多个请求（同个域名、同一条 TCP 链接）。但 pipeling 要求返回是按序的，那么前一个请求如果很耗时（比如处理大图片），那么后面的请求即使服务器已经处理完，仍会等待前面的请求处理完才开始按序返回。
            协议开销大。HTTP/1 在使用时，header 里携带的内容过大，在一定程度上增加了传输的成本，并且每次请求 header 基本不怎么变化，尤其在移动端增加用户流量。
    2.0
    ｜ 2015年5月
        由来
            谷歌公开了自行研发的 SPDY 协议，主要解决 HTTP/1.1 效率不高的问题。这个协议在 Chrome 浏览器上证明 可行以后，就被当作 HTTP/2 的基础，主要特性都在 HTTP/2 之中得到继承
        新特性
            二进制分帧 HTTP 2.0 会将所有传输的信息分割为更小的消息和帧,并对它们采用二进制格式的编码（HTTP1.1以及之前的报文的头信息必须是文本（ASCII 编码），数据体可以是文本，也可以是二进制。）
                

            使用了多路复用（一个域名只使用一个TCP长链接，TCP只慢启动一次）的技术，由于使用了二进制分帧，所以每次请求的数据都采用数据流的形式发送接收，响应不必等待前面的响应完成，服务器会直接把所有的数据包带ID传输回来,然后浏览器会根据ID拼接成完整的HTTP请求或响应数据，这样会解决head of line bloacking队头阻塞问题，并且可以同时处理更多的请求（可以说1.1的长链接是半双工通信，有了多路复用之后变成全双工）
                
             请求头压缩：HTTP 协议不带有状态，每次请求都必须附上所有信息。所以，请求的很多字段都是重复的，比如Cookie和User Agent，一模一样的内容，每次请求都必须附带，这会浪费很多带宽，也影响速度。HTTP/2 对这一点做了优化，引入了头信息压缩机制（header compression）。一方面，头信息使用gzip或compress压缩后再发送；另一方面，客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，生成一个索引号，以后就不发送同样字段了，只发送索引号，这样就提高速度了。
            服务端推送 HTTP/2 允许服务器未经新的请求，主动向客户端发送资源，这叫做服务器推送（server push）。
                https://www.xiaoz.me/archives/13991
                https://www.ruanyifeng.com/blog/2018/03/http2_server_push.html
        局限性
            HTTP的队头阻塞解决了，那TCP的队头阻塞这么办？
            ｜ 由于http2.0的多路复用，使得一个TCP连接可能有多个http连接，如果TCP丢包率高还不如使用HTTP1.1的一个TCP发起一个http请求（研究表明如果丢包率超过2%，http2还不如http1.1快）
            由于TCP的握手机制，是在太过繁琐，并且2.0增加了TLS，服务器和客户端之前的通信RTT次数增加
    3.0
        新增了QUIC（Quick UDP Internet Conection）协议,原因是TCP协议相较于UDP协议建立连接时复杂耗时，所以推出QUIC协议，既有TCP的可靠性又保留了UDP的高效性
            
    参考
        https://cloud.tencent.com/developer/article/1513007
        https://cloud.tencent.com/developer/article/1518678
        https://www.cnblogs.com/mengff/p/12724641.html
        https://www.infoq.cn/article/uallzq6vu7emxbxdkjex
