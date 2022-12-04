import { createBrowserRouter } from 'react-router-dom';
import Contact, {
  loader as contactLoader,
} from '@/components/Contact';
import ErrorPage from '@/components/ErrorPage';
import Root, {
  loader as rootLoader,
  action as rootAction,
} from '@/components/routes/root';
import EditContact, { editAction, editLoader } from '@/components/Edit';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
        loader: contactLoader,
      },
      {
        path: 'contacts/:contactId/edit',
        element: <EditContact />,
        loader: editLoader,
        action: editAction,
      },
    ],
  },
]);
