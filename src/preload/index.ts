import { contextBridge, ipcRenderer } from 'electron';

// Custom APIs for renderer
const api = {
  on(channel: string, callback: (data: string) => void) {
    ipcRenderer.on(channel, (_, ...args: string[]) => {
      callback(args.pop()!);
    });
  },
  send(channel: string, data: string) {
    ipcRenderer.send(channel, data);
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
contextBridge.exposeInMainWorld('electronAPI', api);
