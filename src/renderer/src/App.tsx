import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    window.electronAPI.on('ws:open', (data: string) => {
      console.log('ws:open', data);
    });

    window.electronAPI.on('ws:message', (data: string) => {
      console.log(data.replace(/(\[\d\dm)/g, '\x1b$1'));
    });
  }, []);

  return <div>test</div>;
};

export default App;
