import { useEffect, useCallback, useRef } from 'react';
import { wsService } from '@/services/wsService';

/**
 * useWebSocket
 * Connects to the WS service on mount and exposes on/off/send helpers.
 * The singleton wsService handles reconnection automatically.
 */
export function useWebSocket() {
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!connectedRef.current) {
      wsService.connect();
      connectedRef.current = true;
    }
    return () => {
      // Don't disconnect on unmount — singleton should stay alive for the session.
      // wsService.disconnect() is called on logout instead.
    };
  }, []);

  const on = useCallback((channel, callback) => {
    wsService.on(channel, callback);
  }, []);

  const off = useCallback((channel, callback) => {
    wsService.off(channel, callback);
  }, []);

  const send = useCallback((channel, data) => {
    wsService.send(channel, data);
  }, []);

  return { on, off, send };
}
