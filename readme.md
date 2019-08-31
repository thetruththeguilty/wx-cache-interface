# 将微信wx storage适配为通用cache

## install 安装
```shell
$ npm install wx-cache-interface
```

## usage 使用
```ts
import { createWxCache } from 'wx-cache-interface'

// 如果window.wx为空，则使用window.localStorage
// 如果window.localStorage 也为空，则使用一个普通的memoryCache
let wxCache = createWxCache(window.wx)

// 储存了1
wxCache.save('a', 1)
// 此处save时设置了ttl
// 仅在储存方有自动触发删除操作时才有效，所以此处无任何作用
wxCache.save('a', 1, 60)


wxCache.load('a', 10) // 10秒以内都认为缓存命中
wxCache.load('a') // 默认ttl为1天

let foo = (a) => a
// 相当于调用foo(1)，将结果缓存10秒
wxCache.applyWith('foo', foo, 10, [1])
// 把applyWith包装成一个新方法, 效果同上
let new_foo = wxCache.wrapperWithCall('foo', foo, 10)
```

## 通用cache的接口
```ts
interface ICache {
  save: (key: string, value: TValue, ttl?: number) => Promise<IValueWrapper<TValue>>,
  load: (key: string, ttl?: number) => Promise<TValue | undefined>,
  applyWith: (name: string, func: Function, ttl: number, params: any[]) => Promise<TValue>;
  wrapperWithCall: (name: string, func: Function, ttl: number) => (...params: any[]) => Promise<TValue>;
  timeDivider: () => number;
}
```