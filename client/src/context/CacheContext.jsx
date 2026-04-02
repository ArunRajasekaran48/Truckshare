import { createContext, useCallback, useRef } from 'react';

/**
 * CacheContext
 * Lightweight in-memory cache for arbitrary API data.
 * React Query handles server-state caching; this is for
 * UI-level caching like recently viewed IDs, prefetch hints, etc.
 */
export const CacheContext = createContext(null);

export function CacheProvider({ children }) {
  const cacheRef = useRef(new Map());

  const set = useCallback((key, value, ttlMs = 5 * 60 * 1000) => {
    cacheRef.current.set(key, { value, expiresAt: Date.now() + ttlMs });
  }, []);

  const get = useCallback((key) => {
    const entry = cacheRef.current.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      cacheRef.current.delete(key);
      return null;
    }
    return entry.value;
  }, []);

  const invalidate = useCallback((key) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  const has = useCallback((key) => {
    const entry = cacheRef.current.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) { cacheRef.current.delete(key); return false; }
    return true;
  }, []);

  return (
    <CacheContext.Provider value={{ get, set, invalidate, has }}>
      {children}
    </CacheContext.Provider>
  );
}
