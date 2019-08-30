import { IValueWrapper, createCache } from 'cache-creator'
import { createMemoryCache } from 'cache-creator/memoryCache'

export function createWxCache(
  wxStorage: {
    getStorageSync: (key: string) => any
    setStorageSync: (key: string, value: any) => void
  } | undefined | null
) {
  // @ts-ignore
  if (wxStorage) {
    return createCache(wxStorage, {
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