import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
} from 'react-router-dom';
import { ContactType } from '@/components/ContactData';
import { createContact, getContacts } from '@/components/Contacts';

interface rootLoaderData {
  [contacts: string]: ContactType[];
}

export async function loader() {
  const contacts = await getContacts('');
  return { contacts };
}

export async function action() {
  const contact = await createContact();
  redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts } = useLoaderData() as rootLoaderData;
  const navigation = useNavigation();
  console.log(navigation);
  /* {state: "idle", location: undefined, formAction: undefined, formData: undefined, formEncType: undefined, formMethod: undefined } */
  /* {state: "loading", location: {pathname: '/contacts/1sslh8s', search: '', hash: '', state: null, key: '5w1p5ke8'}, formAction: undefined, formData: undefined, formEncType: undefined, formMethod: undefined */

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
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
