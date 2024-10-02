import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import icon from '../../resources/icon.png?asset';
import WebSocket from 'ws';
import { Buffer } from 'node:buffer';
import iconv from 'iconv-lite';
import platform from './utils/platform';
import isDev from './utils/isDev';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools();
    const webSocket = new WebSocket('wss://ws.ptt.cc/bbs', {
      headers: {
        origin: 'https://term.ptt.cc'
      }
    });

    webSocket.addEventListener('open', () => {
      console.debug('open');
    });

    webSocket.addEventListener('close', () => {
      console.debug('close');
    });

    webSocket.addEventListener('message', (event) => {
      mainWindow.webContents.send(
        'ws:message',
        iconv.decode(event.data as Buffer, 'big5')
      );
    });

    webSocket.addEventListener('error', () => {
      console.debug('error');
    });
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (isDev() && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  if (platform.isWindows)
    app.setAppUserModelId(isDev() ? process.execPath : 'com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    const { webContents } = window;

    webContents.on('before-input-event', (_, input) => {
      if (isDev()) {
        // Toggle devtool(F12)
        if (input.code === 'F12') {
          if (webContents.isDevToolsOpened()) {
            webContents.closeDevTools();
          } else {
            webContents.openDevTools({ mode: 'undocked' });
          }
        }
      }
    });
  });

  // IPC test
  ipcMain.on('ping', () => console.debug('pong'));
  ipcMain.on('from-renderer', () => console.debug('on from renderer'));

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
