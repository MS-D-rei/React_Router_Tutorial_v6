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
    // ... other codes
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
HTML form
1. Browser serializes the form's data
2. Send it to the server as the request body for 'POST'
react-router-dom Form component
1. Browser serializes the form's data as the same above
2. Don't send it to the server. Uses client side routing and send the data to a route 'action'
3. Use not sending data to the server as a hint to revalidate the data on the page.
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
    // other codes,
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