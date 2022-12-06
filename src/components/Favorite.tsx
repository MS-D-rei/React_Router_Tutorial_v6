import { useFetcher } from 'react-router-dom';
import { ContactType } from '@/components/ContactData';

interface FavoriteProps {
  contact: ContactType;
}

export default function Favorite({ contact }: FavoriteProps) {
  const fetcher = useFetcher();
  const favorite = contact.favorite;
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
