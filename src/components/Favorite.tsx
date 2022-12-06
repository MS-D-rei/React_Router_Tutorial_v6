import { useFetcher } from 'react-router-dom';
import { ContactType } from '@/components/ContactData';

interface FavoriteProps {
  contact: ContactType;
}

export default function Favorite({ contact }: FavoriteProps) {
  const fetcher = useFetcher();
  console.log(fetcher);
  let favorite = contact.favorite;
  
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
