import { useCallback, useEffect, useRef } from 'react';

const App = () => {
  const ref = useRef<HTMLDivElement>(null);

  const login = useCallback(() => {
    window.electronAPI.send('ws:login', 'guest\r');
  }, []);

  useEffect(() => {
    window.electronAPI.send('ws:init', '');
    window.electronAPI.on('ws:open', (data: string) => {
      console.log('ws:open', data);
    });

    window.electronAPI.on('ws:message', (data: string) => {
      console.log(data.replace(/(\[\d\dm)/g, '\x1b$1'));
      ref.current!.innerHTML = data.replace(/(\[\d\dm)/g, '\x1b$1');
    });
  }, []);

  return (
    <div>
      <div ref={ref} />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default App;
