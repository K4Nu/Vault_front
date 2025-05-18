import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SlugRouter from './SlugRouter.jsx';

// Define routes with React Router
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/:slug',
        element: <SlugRouter />,
    }
]);

// Initialize React Query client
const queryClient = new QueryClient();

// Render the application
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);