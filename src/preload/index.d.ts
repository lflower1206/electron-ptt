declare global {
  interface Window {
    electronAPI: {
      on: (channel: string, callback: (data: string) => void) => void;
      send: (channel: string, data: string[]) => void;
    };
  }
}
