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

    },
    '.json'(module) {

    }
  }

  static resolvePatnName(id) {
    if (!this.validatePath(id)) return

    let pathName = path.join(__dirname, id)
    let extname = path.extname(pathName)
    
    if (!extname) {
      let extension = Object.keys(this.extensions).find(item => fs.existsSync(pathName + item));
      if (extension) {
        return this.resolvePatnName(pathName + extension)
      }
      throw new Error('文件不存在')
    } else if (!fs.existsSync(pathName)) {
      throw new Error('文件不存在')
    }
    return pathName
  }

  load() {
    console.log();
  }
}


function myRequire(id) {

  if (id === '') throw new Error('路径不能为空a')

  let pathName = Module.resolvePatnName(id);
  
  let module = new Module(pathName);

  module.load()

  return module.exports
}

const add = myRequire('./add')

console.log(add);
