import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


import MainLayout from './components/MainLayout'
import PostsTraditional from './components/PostsTraditional'
import PostDetailsRQ from './components/PostDetailsRQ'
import PostDetailsRQid from './components/PostDetailsRQid'

// Create a client
const queryClient = new QueryClient()


const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      
      {
        path: 'PostsTraditional',
        Component: PostsTraditional
      },

      {
        path: 'PostDetailsRQ',
        Component: PostDetailsRQ
      },

      {
        path: 'PostDetailsRQ/:postId',
        Component: PostDetailsRQid
      },

      
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
