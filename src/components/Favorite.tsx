import { Form } from 'react-router-dom';
import { ContactType } from '@/components/ContactData';

interface FavoriteProps {
  contact: ContactType;
}

export default function Favorite({ contact }: FavoriteProps) {
  const favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </Form>
  );
}
