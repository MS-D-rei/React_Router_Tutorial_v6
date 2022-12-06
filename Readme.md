# React Router Tutorial v6 with TypeScript memo

## useRouteError() type checking

useRouteError() returns 'unknown' type.

```ts
// No type setting
const error = useRouteError();
{error.status;} // => Object is of type 'unknown'.ts(2571)
```

Check the content of the error with conosole.log(error)

```ts
/*
  ErrorResponse
  data: "Error: No route matches URL \"/contacts/1\""
  error: Error: No route matches URL "/contacts/1" at getInternalRouterError (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=439b1c4e:2077:55) at createRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=439b1c4e:890:17) at createBrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=439b1c4e:3187:10) at http://localhost:5173/src/main.tsx?t=1670077204000:9:16
    message: "No route matches URL \"/contacts/1\""
    stack: "Error: No route matches URL \"/contacts/1\"\n    at getInternalRouterError (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=439b1c4e:2077:55)\n    at createRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=439b1c4e:890:17)\n    at createBrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=439b1c4e:3187:10)\n    at http://localhost:5173/src/main.tsx?t=1670077204000:9:16"
  internal: true
  status: 404
  statusText: "Not Found"
  */
```

Type set

```ts
interface RouteError {
  status: number;
  statusText: string;
}

const router = useRouteError() as RouteError; // set type with 'as'
{error.status;} // => 404
{error.statusText;} // => 'Not Found'
```

## useLoaderData is used to pass data through loader prop in router
```ts
// root.tsx, make loader function
export async function loader() {
  const contacts = await getContacts('');
  return contacts;
}
// router.tsx, set the data to loader prop
import { loader as rootLoader } from '@/components/routes/root';
export const router = createBrowserRouter([
  {
    // ... other code
    loader: rootLoader, // (property) NonIndexRouteObject.loader?: LoaderFunction | undefined
  }
]);
// root.tsx, get the data by useLoaderData()
export default function Root() {
  // useLoaderData() returns 'unknown' type. <= export declare function useLoaderData(): unknown;
  const contacts = useLoaderData() as ContactType[];
}
```

## 'Form' component from 'react-router-dom'
The diff between HTML form and react-router-dom Form
- #### HTML form
1. Browser serializes the form's data
2. Send it to the server as the request body for 'POST'

- #### react-router-dom Form component
1. Browser serializes the form's data as the same above
2. Don't send it to the server. Uses client side routing and send the data to a route 'action'
3. Use not sending data to the server as a hint to revalidate the data on the page.
=> Destroy action below is a good example.
```ts
// root.tsx
export async function action() {
  await createContact();
}

export default Root() {
  return (
    <Form method="post">
      <button type="submit">New</button> // when click this button, data will be sent to 'action' in router.tsx
    </Form>
  )
}

// router.tsx
import { action as rootAction,} from '@/components/routes/root';
export const router = createBrowserRoute([
  {
    // other code,
    action: rootAction,
  }
])
```

## LoaderFunctionArgs and ActionFunctionArgs type checking
```ts
// Contact.tsx
import { LoaderFunctionArgs } from 'react-router-dom'
export async function loader({ params }: LoaderFunctionArgs) {
  return getContact(params.contactId);
}
/* This loader func gets the arg below
  {params: {contactId: '1sslh8s'}, request: Request {method: 'GET', url: 'http://localhost:5173/contacts/1sslh8s', 
  headers: Headers, destination: '', referrer: 'about:client', …}
*/
// utils.d.ts
/* Arguments passed to loader functions
   export interface LoaderFunctionArgs extends DataFunctionArgs {}
*/
```

## useNavigation
Returns the current navigation, defaulting to an "idle" navigation when no navigation is in progress
```ts
// root.tsx
export default function Root() {
  const navigation = useNavigation(); // const navigation: Navigation
  // status idle example
  /* {state: "idle", location: undefined, formAction: undefined, formData: undefined, formEncType: undefined, formMethod: undefined } */
  // status loading example
  /*
  { state: "loading", location: {pathname: '/', search: '?q=John', hash: '', state: null, key: 'cyrjwyx5'}
  formAction: undefined, formData: undefined, formEncType: undefined, formMethod: undefined }
   */
}
```

## Destroy action
react-router-dom Form component
1. Browser serializes the form's data as the same above
2. Don't send it to the server. Uses client side routing and send the data to a route 'action'
3. Use not sending data to the server as a hint to revalidate the data on the page.
```ts
// Contact.tsx, Form send the serialized data to action 'destroy'
// relative path is 'contacts/contactId', so this data will be submitted to 'contacts/contactId/destory'
<Form method="post" action="destroy" onSubmit={(event) => {
  if (!confirm('Please confirm you want to delete this record.')) { 
    event.preventDefault();
  }
}}
>
  <button type="submit">Delete</button>
</Form>

// router.tsx, catch the data with path: 'contacts/:contactId/destroy'
// action: destroyAction will be executed.
export const router = createBrowserRouter([
    {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      // other code
      {
        path: 'contacts/:contactId/destroy',
        action: destroyAction,
      },
    ],
  },
])

// Destroy.tsx
export async function destroyAction({ params }: ActionFunctionArgs) {
  await deleteContact(params.contactId);
  return redirect('/');
  // => after redirect, React Router calls all of the loaders for data on the page.
}

// root.tsx
// navigation content
/* {state: "submitting", location: {pathname: '/contacts/7v3xzj0/destroy', search: '', hash: '', state: null, key: 'i5lpfz45'} formAction: "/contacts/7v3xzj0/destroy", formData: FormData {}, formEncType: "application/x-www-form-urlencoded", formMethod: "post"} */
```

## Index routes { index: true, element: <IndexRoutes /> }
```ts
// router.tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // render the element at '<Outlet />' when the path is exact to the parent path.
        element: <IndexRoutes />,
      },
      {
        path: 'contacts/:contactId',
        element: <Contact />,
        loader: contactLoader,
      },
    ],
  },
]);
```

## Synchronizing URLs to Form state
The URL and our form state are out of sync.
1. If you click back after a search, the form field still has the value you entered even though the list is no longer filtered.
2. If you refresh the page after searching, the form field no longer has the value in it, even though the list is filtered.
=> Solution: set defaultValue={query} to input and use useEffect.

```ts
// root.tsx
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // Send this q to Root
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return { contacts, q };
}

interface rootLoaderData {
  contacts: ContactType[];
  // Change null to undefined for <input defaultValue> type checking
  q: string | undefined;
}

export default function Root() {
  // Get q from loader function
  const { contacts, q } = useLoaderData() as rootLoaderData;
  const navigation = useNavigation();

  // this useEffect solve problem No.1.
  // when back to previous page, q will change and this useEffect change the input value.
  useEffect(() => {
    if (q !== undefined) {
      const inputElement = document.getElementById('q') as HTMLInputElement;
      inputElement.value = q;
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              // set the q here
              // this solve problem No.2
              defaultValue={q}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          // other code
```

## Key stroke submitting cause history stack and solution for it.
```ts
// root.tsx
  // existing code
  <input id="q"
    // existing code
    onChange={(event) => {
      const isFirstSearch = q == null;
      // To solve history stack, set the option 'replace'
      // Set true to replace the current entry in the browser's history stack instead of creating a new one
      // (i.e. stay on "the same page"). Defaults to false.
      submit(event.currentTarget.form, {
        replace: !isFirstSearch,
      });
    }}
  />
```

## Favorite button data flow
```ts
// Favorite.tsx
export default function Favorite({ contact }: FavoriteProps) {
  // useFetcher interacts with route loaders and actions without causing a navigation.
  // Great for any interaction that stays on the same page.
  const fetcher = useFetcher();
  const favorite = contact.favorite;
  return (
    <fetcher.Form method="post">
      <button
        // formData will have 'favorite' key
        name="favorite"
        // formData will have 'false' or 'true' value
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
}

// fetcher.Form action='' so send the data to where Favorite is rendered.
// In this case, <Contact /> has <Favorite />. => path: 'contacts/:contactId'
// And call the action.

// router.tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
        loader: contactLoader,
        // This action will be called.
        action: contactAction,
      },

// Contact.tsx
export async function contactAction({params, request}: ActionFunctionArgs) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true'
  })
}
```

## Optimistic UI
```ts
export default function Favorite({ contact }: FavoriteProps) {
  const fetcher = useFetcher();
  let favorite = contact.favorite;
  
  // when submitting, console.log(fetcher) shows as below
  /* { state: "submitting", Form : {$$typeof: Symbol(react.forward_ref), render: ƒ}, data: undefined,
  formAction: "/contacts/eyfs2g8", formData: FormData {}, formEncType: "application/x-www-form-urlencoded",
  formMethod: "post", load: (href) => {…}, submit: ƒ (target, options) }
  */
  // if fetcher.formData.get('favorite') is 'true',
  // use the 'true' as favorite value and show star button icon immediately

  // When fetcher state is idle, fetcher.formData is undefined,
  // so use actual favorite as the data to show star button icon.
  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true';
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
}
```