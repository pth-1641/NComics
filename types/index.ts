export type Comic = {
  average: number;
  chapters: {
    id: number;
    name: string;
  }[];
  description: string;
  followers: number;
  genres: {
    id: string;
    name: string;
  }[];
  is_adult: boolean;
  other_names: string[];
  rating_count: number;
  id: string;
  title: string;
  thumbnail: string;
  status: string;
  total_views: number | string;
  authors: string | string[];
};

export type Comment = {
  avatar: string;
  content: string;
  created_at: string;
  username: string;
  stickers: string[];
  vote_count: number;
};

export type Comments = {
  total_pages: number;
  total_comments: number;
  comments: (Comment & { replies: Comment[] })[];
};
