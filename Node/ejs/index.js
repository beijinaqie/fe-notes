// 模拟实现ejs
const path = require('path')
const fs = require('fs')
const http = require('http')
const crypto = require('crypto')
const child_process = require('child_process')

let data = {
  list: [1, 2, 3],
  name: 'data'
}

let ejs = {
  render(html, data) {
    let header = 'with(data) { \nlet str = ""; \nstr+=`'
    let footer = '`\nreturn str}'
    html = html.replace(/<%=(.+?)%>/g, (match, $1) => {
      return '${' + $1 + '}';
    })
    html = html.replace(/<%(.+?)%>/g, (match, $1) => {
      return '`\n' + $1 + '\nstr += `';
    })

    html = header + html + footer
    return new Function('data', html)(data)
  }
}

let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
let r = ejs.render(html, data)
// console.log(r);

let port = 3000
http.createServer((req, res) => {
  
  let statObj = fs.statSync(path.join(__dirname, 'index.html'))
  let lastModified = statObj.ctime.toGMTString()
  let etag = crypto.createHash('md5').update(lastModified + statObj.size).digest('base64')
  res.setHeader('Etag', etag)
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  if (etag === req.headers['if-none-match']) {
    res.statusCode = 304;
    return res.end();
  }
  console.log(req.url);
  res.end(r)
}).listen(port, () => {
  let map = {
    url: `http://127.0.0.1:${port}`,
    'win32'(){
      child_process.exec(`start ${ this.url }`)
    },
    'darwin'(){
      child_process.exec(`open ${ this.url}`)
    },
    'linux'(){
      child_process.exec(`xdg-open ${ this.url }`)
    }
  }
  map[process.platform]()
  console.log('your server is running at http://127.0.0.1:3000');
})