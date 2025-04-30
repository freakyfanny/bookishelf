export type Book = {
  type: "book";
  slug: string;
  title: string;
  authors: string;
  cover_id?: number;
  first_publish_year?: number;
  subjects?: string[];
  description?: string | { value: string };
  imageUrl?: string;
};

export type Author = {
  type: "author";
  slug: string;
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string;
  top_work?: string;
  top_subjects?: string[];
};

export type AuthorDetails  = {
  name: string;
  bio: string;
  key: string;
};

export type BookDetails = {
  type: { key: string };
  key: string;
  title: string;
  description: { type: string; value: string };
  authors: Author[];
  covers: number[];
  subject_places: string[];
  subjects: string[];
  subject_people: string[];
  first_publish_date: string;
  lc_classifications: string[];
  dewey_number: string[];
  location: string;
  subject_times: string[];
  latest_revision: number;
  revision: number;
  created: { type: string; value: string };
  last_modified: { type: string; value: string };
  imageUrl: string;
};