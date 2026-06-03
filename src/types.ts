export type Category = 'MINDSET' | 'STYLE' | 'TRAVEL' | 'FINANCE' | 'WELLNESS' | 'FOOD' | 'HOME' | 'CULTURE' | 'CARS' | 'EDUCATION';

export interface PostComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  author: Author;
  date: string;
  readTime: string;
  content: string[]; // List of rich paragraphs
  quotes?: string[]; // Pull quotes to disperse through styling
  imageUrl: string;
  tags: string[];
  likes: number;
  comments: PostComment[];
}

export interface MoodItem {
  id: string;
  imageUrl: string;
  quote: string;
  category: string;
}
