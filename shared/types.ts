export type Author = {
    key: string; // "/authors/OL23919A"
    name: string;
    birth_date?: string;
    death_date?: string;
    bio?: string;
    top_work?: string;
    top_subjects?: string[];
  };
  
  export type Book = {
    key: string; // "/works/OL45804W"
    title: string;
    authors: string;
    cover_id?: number;
    first_publish_year?: number;
    subjects?: string[];
    description?: string | { value: string };
    imageUrl?: string;
  };
  