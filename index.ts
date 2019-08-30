import { IValueWrapper, createCache } from 'cache-creator'

export function createLevelCache(
  wxStorage: {
    getStorageSync: (key: string) => string
    setStorageSync: (key: string, value: string) => void
    removeStorageSync: (key: string) => void
  }
) {
  return createCache(wxStorage, {
    getter: async (storage, key) => {
      let res = storage.getStorageSync(key)
      if (!res) return undefined
      let value = JSON.parse(res)
      return value as IValueWrapper<any>
    },
    setter: async (storage, key, value) => {
      storage.setStorageSync(key, JSON.stringify(value))
      return value
    },
    onTimeout: async (storage, key, box) => {
      storage.removeStorageSync(key)
    },
  })
}