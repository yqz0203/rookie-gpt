import { Outlet, createBrowserRouter, redirect } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';

function Layout() {
  return (
    <main className="absolute inset-0 overflow-hidden bg-black">
      <div id="stars1"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
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
