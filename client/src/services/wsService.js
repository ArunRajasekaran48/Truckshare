const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:9191/ws';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.reconnectDelay = 3000;
    this.shouldReconnect = true;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('[WS] Connected');
        this.reconnectDelay = 3000;
      };

      this.ws.onmessage = (event) => {
        try {
          const { channel, data } = JSON.parse(event.data);
          const cbs = this.listeners[channel] || [];
          cbs.forEach((cb) => cb(data));
        } catch (e) {
          console.warn('[WS] Parse error', e);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[WS] Error', err);
      };

      this.ws.onclose = () => {
        console.log('[WS] Disconnected');
        if (this.shouldReconnect) {
          setTimeout(() => this.connect(), this.reconnectDelay);
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
        }
      };
    } catch (e) {
      console.warn('[WS] Could not connect:', e.message);
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    this.ws?.close();
  }

  on(channel, callback) {
    if (!this.listeners[channel]) this.listeners[channel] = [];
    this.listeners[channel].push(callback);
  }

  off(channel, callback) {
    if (this.listeners[channel]) {
      this.listeners[channel] = this.listeners[channel].filter((cb) => cb !== callback);
    }
  }

  send(channel, data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ channel, data }));
    }
  }
}

export const wsService = new WebSocketService();
