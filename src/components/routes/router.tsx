import { createBrowserRouter } from 'react-router-dom';
import Contact, {
  contactAction,
  loader as contactLoader,
} from '@/components/Contact';
import ErrorPage from '@/components/ErrorPage';
import Root, {
  loader as rootLoader,
  action as rootAction,
} from '@/components/routes/root';
import EditContact, { editAction, editLoader } from '@/components/Edit';
import { destroyAction } from '@/components/Destroy';
import IndexRoutes from '@/components/IndexRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <IndexRoutes />,
          },
          {
            path: 'contacts/:contactId',
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: 'contacts/:contactId/edit',
            element: <EditContact />,
            loader: editLoader,
            action: editAction,
          },
          {
            path: 'contacts/:contactId/destroy',
            action: destroyAction,
            errorElement: <div>Oops! There was an error</div>,
          },
        ],
      },
    ],
  },
]);
