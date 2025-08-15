export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  avatar?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  followers?: number;
  following?: number;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  image?: string;
  user?: User;
  reactions?: number | { likes: number; dislikes: number };
  tags?: string[];
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt?: string;
  location?: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  user: User;
  body: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface CreatePostData {
  title: string;
  body: string;
  userId: number;
  image?: string;
  tags?: string[];
  location?: string;
}

export interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  username: string;
  name?: string;
  avatar?: string;
  followers?: number;
  following?: number;
}

export interface DummyPost {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  image?: string;
  reactions?: {
    likes: number;
    dislikes: number;
  } | number;
  comments?: number;
  shares?: number;
  likes?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt?: string;
  location?: string;
}

export interface LikeData {
  postId: number;
  userId: number;
  isLiked: boolean;
}

export interface CommentData {
  postId: number;
  userId: number;
  body: string;
  parentId?: number;
}

export interface ShareData {
  postId: number;
  userId: number;
  platform: 'instagram' | 'facebook' | 'twitter' | 'whatsapp' | 'copy';
}