import { createBrowserRouter } from 'react-router-dom';
import Contact from '@/components/Contact';
import ErrorPage from '@/components/ErrorPage';
import Root, { loader as rootLoader } from '@/components/routes/root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
      },
    ],
  },
]);
