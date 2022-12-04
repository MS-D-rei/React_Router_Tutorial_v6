import { createBrowserRouter } from 'react-router-dom';
import Contact from '@/components/Contact';
import ErrorPage from '@/components/ErrorPage';
import { Root } from '@/components/routes/root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
      },
    ],
  },
]);
