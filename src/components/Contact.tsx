import { ActionFunctionArgs, Form, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { ContactType } from '@/components/ContactData';
import Favorite from '@/components/Favorite';
import { getContact, updateContact } from '@/components/Contacts';

export async function loader({ params }: LoaderFunctionArgs) {
  /*
    This loader func gets the arg below
    {params: {contactId: '1sslh8s'}, request: Request {method: 'GET', url: 'http://localhost:5173/contacts/1sslh8s', headers: Headers, destination: '', referrer: 'about:client', …}
  */
  // console.log(params);
  /* {contactId: '1sslh8s'} */
  return getContact(params.contactId);
}

export async function contactAction({params, request}: ActionFunctionArgs) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true'
  })
}

export default function Contact() {
  const contact = useLoaderData() as ContactType;
  return (
    <div id="contact">
      <div>
        <img src={contact.avatar || undefined} key={contact.avatar} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`} target="_blank">
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
