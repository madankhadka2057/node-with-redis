export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  category?: Category;
  date: string;
  readTime: string;
  image?: string;
  likes?: Like[];
  comments?: Comment[];
  favorites?: Favorite[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt?: Date;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  postId: string;
  createdAt?: Date;
}

export interface Category {

  id: string;
  name: string;
  slug: string;
  posts?: Post[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreatePostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'category'>;
export type UpdatePostInput = Partial<CreatePostInput>;

export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'posts'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

