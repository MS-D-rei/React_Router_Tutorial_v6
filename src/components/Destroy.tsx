import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { deleteContact } from '@/components/Contacts';

export async function destroyAction({ params }: ActionFunctionArgs) {
  await deleteContact(params.contactId);
  return redirect('/');
}
