import { IValueWrapper, createCache } from 'cache-creator'

export function createLevelCache(
  wxStorage: {
    getStorageSync: (key: string) => any
    setStorageSync: (key: string, value: any) => void
  }
) {
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