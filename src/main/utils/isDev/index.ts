import { app } from 'electron';

const isDev = () => {
  return !app.isPackaged;
};

export default isDev;
