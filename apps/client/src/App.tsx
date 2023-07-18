import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';
import Router from './Router';
import 'react-tooltip/dist/react-tooltip.css';
import { Toaster } from 'react-hot-toast';
import request from './utils/request';

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: params => {
          if (!Array.isArray(params)) {
            params = [params];
          }
          return request.get(params[0], params[1]);
        },
      }}
    >
      <RouterProvider router={Router} />
      <Toaster toastOptions={{ style: { fontSize: 14 } }} />
    </SWRConfig>
  );
}

export default App;
