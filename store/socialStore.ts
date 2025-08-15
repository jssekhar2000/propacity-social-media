import { create } from 'zustand';
import { Post, DummyPost, Comment, LikeData, CommentData, ShareData } from '@/types/api';

interface SocialState {
  posts: (Post | DummyPost)[];
  likedPosts: number[];
  savedPosts: number[];
  comments: Comment[];
  likedComments: number[];
}

interface SocialActions {
  addPost: (post: Post) => void;
  updatePost: (postId: number, updates: Partial<Post>) => void;
  deletePost: (postId: number) => void;
  likePost: (postId: number) => void;
  unlikePost: (postId: number) => void;
  savePost: (postId: number) => void;
  unsavePost: (postId: number) => void;
  addComment: (commentData: CommentData) => void;
  likeComment: (commentId: number, userId: number) => void;
  unlikeComment: (commentId: number, userId: number) => void;
  getPostComments: (postId: number) => Comment[];
  isPostLiked: (postId: number) => boolean;
  isPostSaved: (postId: number) => boolean;
  getLikedPosts: () => (Post | DummyPost)[];
  getSavedPosts: () => (Post | DummyPost)[];
}

export const useSocialStore = create<SocialState & SocialActions>((set, get) => ({
  posts: [],
  likedPosts: [],
  savedPosts: [],
  comments: [],
  likedComments: [],

  addPost: (post) => {
    set((state) => ({
      posts: [post, ...state.posts],
    }));
  },

  updatePost: (postId, updates) => {
    set((state) => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, ...updates }
          : post
      ),
    }));
  },

  deletePost: (postId) => {
    set((state) => ({
      posts: state.posts.filter(post => post.id !== postId),
    }));
  },

  likePost: (postId) => {
    set((state) => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: ((post as any).likes || 0) + 1,
              isLiked: true,
            }
          : post
      ),
      likedPosts: [...state.likedPosts, postId],
    }));
  },

  unlikePost: (postId) => {
    set((state) => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: Math.max(0, ((post as any).likes || 0) - 1),
              isLiked: false,
            }
          : post
      ),
      likedPosts: state.likedPosts.filter(id => id !== postId),
    }));
  },

  savePost: (postId) => {
    set((state) => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, isSaved: true }
          : post
      ),
      savedPosts: [...state.savedPosts, postId],
    }));
  },

  unsavePost: (postId) => {
    set((state) => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, isSaved: false }
          : post
      ),
      savedPosts: state.savedPosts.filter(id => id !== postId),
    }));
  },

  addComment: (commentData) => {
    const newComment: Comment = {
      id: Date.now(),
      postId: commentData.postId,
      userId: commentData.userId,
      body: commentData.body,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      user: {
        id: commentData.userId,
        name: 'User',
        username: 'user',
        email: 'user@example.com',
      } as any,
    };

    set((state) => ({
      comments: [newComment, ...state.comments],
    }));
  },

  likeComment: (commentId, userId) => {
    set((state) => ({
      comments: state.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1, isLiked: true }
          : comment
      ),
      likedComments: [...state.likedComments, commentId],
    }));
  },

  unlikeComment: (commentId, userId) => {
    set((state) => ({
      comments: state.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: Math.max(0, comment.likes - 1), isLiked: false }
          : comment
      ),
      likedComments: state.likedComments.filter(id => id !== commentId),
    }));
  },

  getPostComments: (postId) => {
    return get().comments.filter(comment => comment.postId === postId);
  },

  isPostLiked: (postId) => {
    return get().likedPosts.includes(postId);
  },

  isPostSaved: (postId) => {
    return get().savedPosts.includes(postId);
  },

  getLikedPosts: () => {
    return get().posts.filter(post => get().likedPosts.includes(post.id));
  },

  getSavedPosts: () => {
    return get().posts.filter(post => get().savedPosts.includes(post.id));
  },
}));
