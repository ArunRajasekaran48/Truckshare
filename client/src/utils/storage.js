/**
 * storage.js
 * Type-safe localStorage wrapper.
 * All methods are try/catch safe — never throw in production.
 */

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },

  // Auth-specific helpers
  getToken: () => localStorage.getItem('authToken'),
  getUserId: () => localStorage.getItem('userId'),
  getUserRole: () => localStorage.getItem('userRole'),

  setAuth(token, userId, role) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', role);
  },

  clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  },
};
