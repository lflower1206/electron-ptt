import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { Buffer } from 'node:buffer';
import {
  getInstance,
  initialize,
  registerMessageEventCallback
} from '../setupWebSocket';
import iconv from 'iconv-lite';

const setupIpcMain = (mainWindow: BrowserWindow) => {
  ipcMain.on('ws:init', () => {
    registerMessageEventCallback((event) => {
      mainWindow.webContents.send(
        'ws:message',
        iconv.decode(event.data as Buffer, 'big5')
      );
    });
    initialize();
  });

  ipcMain.on('ws:login', (_: IpcMainEvent, ...args: string[]) => {
    getInstance().send(Buffer.from(args[0]), (error) => {
      if (error) {
        console.error(error);
        return;
      }
    });
  });
};

export default setupIpcMain;
