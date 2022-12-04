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

## 'Form' component from 'react-router-dom'

```ts
<Form
  method="post" // Supports 'get', 'post', 'put', 'delete', 'patch'
  action="destroy"
  onSubmit={(event) => { // By default set event: React.FormEvent<HTMLFormElement> 
    if (!confirm('Please confirm you want to delete this record.')) {
      event.preventDefault();
    }
  }}
>
  <button type="submit">Delete</button>
</Form>
```
