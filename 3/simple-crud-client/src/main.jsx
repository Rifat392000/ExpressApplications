import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MainLayout from './layouts/MainLayout.jsx';
import UserDetail from './components/UserDetail.jsx';
import UpdateUser from './components/UpdateUser.jsx';

import { createBrowserRouter,RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => fetch('http://localhost:3000/'),
    Component: MainLayout,
    children: [

      {
        index: true,
        loader: () => fetch('http://localhost:3000/users'),
        Component: App
      },
      
      {
        path: 'users/:id',
        loader: ({ params }) => fetch(`http://localhost:3000/users/${params.id}`),
        Component: UserDetail
      },

      {
        path: 'update/:id',
        loader: ({ params }) => fetch(`http://localhost:3000/users/${params.id}`),
        Component: UpdateUser
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
