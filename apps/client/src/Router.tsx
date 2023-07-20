import { Outlet, createBrowserRouter, redirect } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { StarBg } from './components';

function Layout() {
  return (
    <main className="absolute inset-0 overflow-hidden">
      <StarBg />
      <Outlet />
    </main>
  );
}

export default createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Chat />,
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    path: '/chat',
    loader: async () => {
      throw redirect(`/`);
    },
  },
]);
