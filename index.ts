import { IValueWrapper, createCache, ICache } from 'cache-creator'
import { createMemoryCache } from 'cache-creator/memoryCache'

export function createWxCache<T>(
  wxStorage: {
    getStorageSync: (key: string) => any
    setStorageSync: (key: string, value: any) => void
  } | undefined | null
): ICache<T> {

  // @ts-ignore
  let _localStorage = {
    getStorageSync: (key: string) => {
      try {
        // @ts-ignore
        return JSON.parse(window.localStorage.getItem(key))
      }
      catch (e) {
        return false
      }
    },
    // @ts-ignore
    setStorageSync: (key: string, value: any) => window.localStorage.setItem(key, JSON.stringify(value)),
  }

  if (wxStorage || window.localStorage) {
    return createCache(wxStorage || _localStorage, {
      getter: async (storage, key) => {
        let value = storage.getStorageSync(key)
        if (!value) return undefined
        return value as IValueWrapper<any>
      },
      setter: async (storage, key, value) => {
        storage.setStorageSync(key, value)
        return value
      },
      onTimeout: async (storage, key, box) => {
        storage.setStorageSync(key, {})
      },
    })
  }
  else {
    console.warn("your input value is not a storage.")
    console.warn("then use memory cache as default")
    return createMemoryCache(500)
  }
}