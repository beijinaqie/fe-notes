/*
  栈是一种遵从后进先出（LIFO）原则的有序集合。新添加或待删除的元素都保存在栈的同一端，称作栈顶，另一端就叫栈底。在栈里，新元素都靠近栈顶，旧元素都接近栈底。
*/

class Stack {
  constructor() {
    // 使用对象来模拟栈，是为了避免数组模拟栈时方法的复杂性
    this.count = 0;
    this.tables = {}
  }

  // 添加一个元素到栈顶
  push(element) {
    this.tables[this.count++] = element;
    return this.count
  }
  // 移除栈顶的元素，并返回移除的元素
  pop() {

  }
  // 返回栈顶的元素
  peek() {

  }
  // 判断栈是否为空
  isEmpty() {
    return this.count === 0;
  }
  // 移除栈里所有的元素
  clear() {

  }
  // 返回栈里的元素个数
  size() {
    return this.count
  }
}

const s = new Stack();
const assert = require('assert');

describe('Stack', () => {
  describe('isEmpty函数', () => {

    it('没有元素时返回false，否则返回true', () => {
      assert.equal(s.isEmpty(), true)
    })

    it('size函数返回元素的个数', () => {
      assert.equal(s.size(), 0)
    })

  })

  describe('push函数', () => {

    it('添加一个元素到栈顶，并返回长度', () => {
      assert.equal(s.push(1), 1)
    })

    it('isEmpty函数没有元素时返回false，否则返回true', () => {
      assert.equal(s.isEmpty(), false)
    })
    
    it('size函数，返回元素的个数', () => {
      assert.equal(s.size(), 1)
    })
  })
})
