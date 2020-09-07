[toc]

# Vue3简介

## 更好的逻辑复用与代码组织

+ 随着功能的增长，复杂组件的代码变得越来越难以阅读和理解。这种情况在开发人员阅读他人编写的代码时尤为常见。根本原因是 Vue 现有的 API 迫使我们通过选项组织代码，但是有的时候通过逻辑关系组织代码更有意义
+ 目前缺少一种简洁且低成本的机制来提取和重用多个组件之间的逻辑

## 更好的类型推导

​	另一个来自大型项目开发者的常见需求是更好的 TypeScript 支持。Vue 当前的 API 在集成 TypeScript 时遇到了不小的麻烦，其主要原因是 Vue 依靠一个简单的 `this` 上下文来暴露 property，我们现在使用 `this` 的方式是比较微妙的。（比如 `methods` 选项下的函数的 `this` 是指向组件实例的，而不是这个 `methods` 对象）。

换句话说，Vue 现有的 API 在设计之初没有照顾到类型推导，这使适配 TypeScript 变得复杂。

​	当前，大部分使用 TypeScript 的 Vue 开发者都在通过 `vue-class-component` 这个库将组件撰写为 TypeScript class (借助 decorator)。我们在设计 3.0 时曾有[一个已废弃的 RFC](https://github.com/vuejs/rfcs/pull/17)，希望提供一个内建的 Class API 来更好的解决类型问题。然而当讨论并迭代其具体设计时，我们注意到，想通过 Class API 来解决类型问题，就必须依赖 decorator——一个在实现细节上存在许多未知数的非常不稳定的 stage 2 提案。基于它是有极大风险的。([关于 Class API 的类型相关问题请移步这里](https://composition-api.vuejs.org/zh/#class-api-的类型问题))。

相比较过后，本 RFC 中提出的方案更多地利用了天然对类型友好的普通变量与函数。用该提案中的 API 撰写的代码会完美享用类型推导，并且也不用做太多额外的类型标注。

这也同样意味着你写出的 JavaScript 代码几乎就是 TypeScript 的代码。即使是非 TypeScript 开发者也会因此得到更好的 IDE 类型支持而获益。

# Vue3 新特性

## Composition API



## Multiple root elements

## Suspense

## Multiple v-model

## Reactivity

## Portals

## Transition

## Remove Filter

## App configration

