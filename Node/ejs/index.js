// 模拟实现ejs
const path = require('path')
const fs = require('fs')

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
console.log(r);
