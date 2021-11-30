// 从头实现一个自己的commonjs

class Module {

  constructor(id) {

  }

  static resolvePatnName(id) {
    
  }
}


function myRequire(id) {

  let path = Module.resolvePatnName(id);
  
  let module = new Module(path);

  return module.exports
}

const add = myRequire('./add')

console.log(add);