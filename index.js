"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_creator_1 = require("cache-creator");
const memoryCache_1 = require("cache-creator/memoryCache");
function createWxCache(wxStorage) {
    // @ts-ignore
    if (wxStorage) {
        return cache_creator_1.createCache(wxStorage, {
            getter: (storage, key) => __awaiter(this, void 0, void 0, function* () {
                let value = storage.getStorageSync(key);
                if (!value)
                    return undefined;
                return value;
            }),
            setter: (storage, key, value) => __awaiter(this, void 0, void 0, function* () {
                storage.setStorageSync(key, value);
                return value;
            }),
            onTimeout: (storage, key, box) => __awaiter(this, void 0, void 0, function* () {
                storage.setStorageSync(key, {});
            }),
        });
    }
    else {
        console.warn("your input value is not a storage.");
        console.warn("then use memory cache as default");
        return memoryCache_1.createMemoryCache(500);
    }
}
exports.createWxCache = createWxCache;
