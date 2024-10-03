import WebSocket, { MessageEvent } from 'ws';

type MessageCallback = (event: MessageEvent) => void;

let webSocket: WebSocket;
const messageEventCallbacks: MessageCallback[] = [];

export const registerMessageEventCallback = (callback: MessageCallback) => {
  messageEventCallbacks.push(callback);
};

export const initialize = () => {
  if (!webSocket) {
    webSocket = new WebSocket('wss://ws.ptt.cc/bbs', {
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
      // mainWindow.webContents.send(
      //   'ws:message',
      //   iconv.decode(event.data as Buffer, 'big5')
      // );
      console.debug('message');
      messageEventCallbacks.forEach((callback) => {
        callback(event);
      });
    });

    webSocket.addEventListener('error', () => {
      console.debug('error');
    });
  }
};

export const getInstance = () => webSocket;
