import {
  Form,
  LoaderFunctionArgs,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { ContactType } from '@/components/ContactData';
import { createContact, getContacts } from '@/components/Contacts';
import { useEffect } from 'react';

interface rootLoaderData {
  contacts: ContactType[];
  // Change null to undefined for <input defaultValue> type checking
  q: string | undefined;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts, q } = useLoaderData() as rootLoaderData;
  const navigation = useNavigation();
  // console.log(navigation);
  /* {state: "idle", location: undefined, formAction: undefined, formData: undefined, formEncType: undefined, formMethod: undefined } */
  /*
  { state: "loading", location: {pathname: '/', search: '?q=John', hash: '', state: null, key: 'cyrjwyx5'}
  formAction: undefined, formData: undefined, formEncType: undefined, formMethod: undefined }
   */
  const submit = useSubmit();

  const isSearching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    if (q !== undefined) {
      const inputElement = document.getElementById('q') as HTMLInputElement;
      inputElement.value = q;
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={isSearching ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
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
            <div id="search-spinner" aria-hidden hidden={!isSearching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  );
}
