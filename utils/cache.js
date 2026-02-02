/**
 * Advanced Caching Strategy
 * Client-side caching with IndexedDB and Memory cache
 */

/**
 * Memory Cache
 */
class MemoryCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttl = 3600000) {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: ttl ? Date.now() + ttl : null,
    });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    return this.cache.has(key) && this.get(key) !== null;
  }
}

/**
 * IndexedDB Cache
 */
class IndexedDBCache {
  constructor(dbName = 'roomgenius-cache', storeName = 'cache') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  async init() {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async get(key) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const item = request.result;
        if (!item) {
          resolve(null);
          return;
        }

        // Check if expired
        if (item.expiresAt && Date.now() > item.expiresAt) {
          this.delete(key);
          resolve(null);
          return;
        }

        resolve(item.value);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async set(key, value, ttl = 3600000) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(
        {
          value,
          expiresAt: ttl ? Date.now() + ttl : null,
        },
        key
      );

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Multi-layer Cache
 */
class MultiLayerCache {
  constructor() {
    this.memoryCache = new MemoryCache();
    this.indexedDBCache = new IndexedDBCache();
  }

  async get(key) {
    // Try memory cache first
    let value = this.memoryCache.get(key);
    if (value !== null) return value;

    // Try IndexedDB
    value = await this.indexedDBCache.get(key);
    if (value !== null) {
      // Promote to memory cache
      this.memoryCache.set(key, value);
      return value;
    }

    return null;
  }

  async set(key, value, ttl = 3600000) {
    this.memoryCache.set(key, value, ttl);
    await this.indexedDBCache.set(key, value, ttl);
  }

  async delete(key) {
    this.memoryCache.delete(key);
    await this.indexedDBCache.delete(key);
  }

  async clear() {
    this.memoryCache.clear();
    await this.indexedDBCache.clear();
  }
}

// Singleton instance
export const cache = new MultiLayerCache();

/**
 * Cache decorator for async functions
 */
export function cached(ttl = 3600000) {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const cacheKey = `${propertyKey}-${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cachedValue = await cache.get(cacheKey);
      if (cachedValue !== null) {
        return cachedValue;
      }

      // Call original method
      const result = await originalMethod.apply(this, args);
      
      // Store in cache
      await cache.set(cacheKey, result, ttl);
      
      return result;
    };

    return descriptor;
  };
}

/**
 * Preload data into cache
 */
export async function preloadCache(data) {
  const promises = Object.entries(data).map(([key, value]) =>
    cache.set(key, value)
  );
  await Promise.all(promises);
}

/**
 * Cache statistics
 */
export function getCacheStats() {
  return {
    memorySize: cache.memoryCache.cache.size,
    memoryMaxSize: cache.memoryCache.maxSize,
  };
}
