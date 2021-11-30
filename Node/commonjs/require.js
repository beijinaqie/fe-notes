// 从头实现一个自己的commonjs
const path = require('path')
const fs = require('fs')
const vm = require('vm')
class Module {

  constructor(id) {
    this.id = id;
    this.exports = {}
  }

  static validatePath(id) {
    // demo使用，不代表全部
    const internalModule = ['fs', 'vm', 'path', 'net', 'oss', 'crypto', 'events', 'buffer', 'http'];
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'))
    const externalModule = [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.devDependencies)]
    
    if (id.startsWith('./') || id.startsWith('../')) {
      return true
    } else if (internalModule.includes(id)) {
      console.log('node内置模块');
      return false
    }  else if (externalModule.includes(id)) {
      console.log('第三方模块');
      return false
    }
  }

  static extensions = {
    '.js'(module) {
      let dirname = module.id.split('/').slice(0, -1).join('/')
      let script = fs.readFileSync(module.id, 'utf-8')
      let fn = new Function('exports', 'require', 'module', '__dirname', '__filename', script)

      fn.call(module.exports, module.exports, myRequire, module, dirname, module.id)
    },
    '.json'(module) {
      let json = JSON.parse(fs.readFileSync(module.id))
      module.exports = json
    }
  }

  static cache = {}

  static resolveFileName(id) {
    if (!this.validatePath(id)) return
    let curFilePath = process.argv.slice(1, 2)[0];
    let curDirPath = curFilePath.split('/').slice(0, -1).join('/')

    let filePath = path.join(curDirPath, id)

    if (fs.existsSync(filePath)) return filePath

    for (let ext of Object.keys(this.extensions)) {
      if (fs.existsSync(filePath + ext)) return filePath + ext
    }

    throw new Error('文件不存在')
  }

  load() {
    let extname = path.extname(this.id);
    Module.extensions[extname](this)
  }
}


function myRequire(id) {

  if (id === '') throw new Error('路径不能为空a')

  let filePath = Module.resolveFileName(id);
  
  if (Module.cache[filePath]) {
    return Module.cache[filePath].exports
  }
  let module = new Module(filePath);

  Module.cache[filePath] = module

  module.load()

  return module.exports
}

let add = myRequire('./add')

console.log(add);
