export interface ContactType {
  id?: string;
  first: string;
  last: string;
  avatar: string;
  twitter: string;
  notes: string;
  favorite: boolean;
}

export const contact: ContactType = {
  first: 'Your',
  last: 'Name',
  avatar: 'https://placekitten.com/g/200/200',
  twitter: 'your_handle',
  notes: 'Some notes',
  favorite: true,
};
