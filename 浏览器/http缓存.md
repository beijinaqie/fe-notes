> http缓存是浏览器的优化技术，可以加快资源获取速度，提升用户体验，减少网络传输，缓解服务端的压力，但是这也产生一个新的问题，那就是资源如何同步，为了使资源能够同步，因此设计了一大堆字段`Cache-Control`，`ETag`，`Last-Modified`在header里面

# 缓存使用的优先级

优先使用强制缓存，如果命中强制缓存，则浏览器即不需要发送请求直接使用已经缓存的数据，如果没有命中则进行下一步缓存，和服务器之间的协商缓存

![](http://zcy-cdn.oss-cn-shanghai.aliyuncs.com/f2e-assets/c3c22890-140e-4cef-9999-068585b6c31c.jpg?x-oss-process=image/quality,Q_75)

# 强制缓存

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

# 协商缓存

当浏览器的强缓存失效的时候或者请求头中设置了不走强缓存，并且在请求头中设置了If-Modified-Since 或者 If-None-Match 的时候，会将这两个属性值到服务端去验证是否命中协商缓存，如果命中了协商缓存，会返回 304 状态，加载浏览器缓存，并且响应头会设置 Last-Modified 或者 ETag 属性。ETag优先级较高，原因是Last-Modified的单位是秒，如果存在一秒内资源多次变动，则就可能资源不准确，而ETag每次变动都会生成新的hash，但是生成hash又需要资源，所以根据项目需求使用吧

+ ETag/If-None-Match

  ETag/If-None-Match 的值是一串 hash 码，代表的是一个资源的标识符，当服务端的文件变化的时候，它的 hash码会随之改变，通过请求头中的 If-None-Match 和当前文件的 hash 值进行比较，如果相等则表示命中协商缓存。ETag 又有强弱校验之分，如果 hash 码是以 "W/" 开头的一串字符串，说明此时协商缓存的校验是弱校验的，只有服务器上的文件差异（根据 ETag 计算方式来决定）达到能够触发 hash 值后缀变化的时候，才会真正地请求资源，否则返回 304 并加载浏览器缓存。

+ Last-Modified/If-Modified-Since

  Last-Modified/If-Modified-Since 的值代表的是文件的最后修改时间，第一次请求服务端会把资源的最后修改时间放到 Last-Modified 响应头中，第二次发起请求的时候，请求头会带上上一次响应头中的 Last-Modified 的时间，并放到 If-Modified-Since 请求头属性中，服务端根据文件最后一次修改时间和 If-Modified-Since 的值进行比较，如果相等，返回 304 ，并加载浏览器缓存。

# 刷新获取资源

+ 回车

  直接读取

+ f5

  浏览器会在请求头带上If-Modified-Since

+ ctrl + f5

  去除缓存，在请求资源