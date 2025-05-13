import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
// import Product from './components/Product.jsx';
import Category from './components/Category.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Define routes with React Router
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    // Uncomment to enable product routes by slug + ID pattern
    // {
    //   path: '/:slug([a-z0-9\-]+-[0-9a-f]{8})',
    //   element: <Product />,
    // },
    {
        path: '/:slug',
        element: <Category />,
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