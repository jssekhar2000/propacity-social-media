import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, DummyPost, Comment, LikeData, CommentData, ShareData } from '@/types/api';

interface SocialState {
  // Posts
  posts: (Post | DummyPost)[];
  likedPosts: Set<number>;
  savedPosts: Set<number>;
  
  // Comments
  comments: Record<number, Comment[]>;
  
  // Actions
  likePost: (postId: number, userId: number) => void;
  unlikePost: (postId: number, userId: number) => void;
  savePost: (postId: number) => void;
  unsavePost: (postId: number) => void;
  addComment: (commentData: CommentData) => void;
  likeComment: (commentId: number, userId: number) => void;
  unlikeComment: (commentId: number, userId: number) => void;
  sharePost: (shareData: ShareData) => Promise<boolean>;
  
  // Getters
  isPostLiked: (postId: number) => boolean;
  isPostSaved: (postId: number) => boolean;
  getPostComments: (postId: number) => Comment[];
  getLikedPosts: () => (Post | DummyPost)[];
  getSavedPosts: () => (Post | DummyPost)[];
  
  // Initialize
  initializePosts: (posts: (Post | DummyPost)[]) => void;
  addPost: (post: Post | DummyPost) => void;
  updatePost: (postId: number, updates: Partial<Post | DummyPost>) => void;
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      posts: [],
      likedPosts: new Set(),
      savedPosts: new Set(),
      comments: {},

      likePost: (postId: number, userId: number) => {
        set((state) => {
          const newLikedPosts = new Set(state.likedPosts);
          newLikedPosts.add(postId);
          
          const updatedPosts = state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likes: (post.likes || 0) + 1,
                isLiked: true,
              };
            }
            return post;
          });

          return {
            likedPosts: newLikedPosts,
            posts: updatedPosts,
          };
        });
      },

      unlikePost: (postId: number, userId: number) => {
        set((state) => {
          const newLikedPosts = new Set(state.likedPosts);
          newLikedPosts.delete(postId);
          
          const updatedPosts = state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likes: Math.max(0, (post.likes || 0) - 1),
                isLiked: false,
              };
            }
            return post;
          });

          return {
            likedPosts: newLikedPosts,
            posts: updatedPosts,
          };
        });
      },

      savePost: (postId: number) => {
        set((state) => {
          const newSavedPosts = new Set(state.savedPosts);
          newSavedPosts.add(postId);
          
          const updatedPosts = state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                isSaved: true,
              };
            }
            return post;
          });

          return {
            savedPosts: newSavedPosts,
            posts: updatedPosts,
          };
        });
      },

      unsavePost: (postId: number) => {
        set((state) => {
          const newSavedPosts = new Set(state.savedPosts);
          newSavedPosts.delete(postId);
          
          const updatedPosts = state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                isSaved: false,
              };
            }
            return post;
          });

          return {
            savedPosts: newSavedPosts,
            posts: updatedPosts,
          };
        });
      },

      addComment: (commentData: CommentData) => {
        const newComment: Comment = {
          id: Date.now(),
          postId: commentData.postId,
          userId: commentData.userId,
          user: {
            id: commentData.userId,
            name: 'Current User',
            username: 'currentuser',
            email: 'user@example.com',
          },
          body: commentData.body,
          likes: 0,
          isLiked: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const postComments = state.comments[commentData.postId] || [];
          const updatedComments = {
            ...state.comments,
            [commentData.postId]: [...postComments, newComment],
          };

          const updatedPosts = state.posts.map(post => {
            if (post.id === commentData.postId) {
              return {
                ...post,
                comments: (post.comments || 0) + 1,
              };
            }
            return post;
          });

          return {
            comments: updatedComments,
            posts: updatedPosts,
          };
        });
      },

      likeComment: (commentId: number, userId: number) => {
        set((state) => {
          const updatedComments = { ...state.comments };
          
          Object.keys(updatedComments).forEach(postId => {
            updatedComments[Number(postId)] = updatedComments[Number(postId)].map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: (comment.likes || 0) + 1,
                  isLiked: true,
                };
              }
              return comment;
            });
          });

          return { comments: updatedComments };
        });
      },

      unlikeComment: (commentId: number, userId: number) => {
        set((state) => {
          const updatedComments = { ...state.comments };
          
          Object.keys(updatedComments).forEach(postId => {
            updatedComments[Number(postId)] = updatedComments[Number(postId)].map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: Math.max(0, (comment.likes || 0) - 1),
                  isLiked: false,
                };
              }
              return comment;
            });
          });

          return { comments: updatedComments };
        });
      },

      sharePost: async (shareData: ShareData): Promise<boolean> => {
        // Simulate sharing to different platforms
        try {
          set((state) => {
                      const updatedPosts = state.posts.map(post => {
            if (post.id === shareData.postId) {
              return {
                ...post,
                shares: (post.shares || 0) + 1,
              };
            }
            return post;
          });

            return { posts: updatedPosts };
          });

          // Simulate platform-specific sharing
          switch (shareData.platform) {
            case 'instagram':
              console.log('Sharing to Instagram...');
              break;
            case 'facebook':
              console.log('Sharing to Facebook...');
              break;
            case 'twitter':
              console.log('Sharing to Twitter...');
              break;
            case 'whatsapp':
              console.log('Sharing to WhatsApp...');
              break;
            case 'copy':
              console.log('Copying link to clipboard...');
              break;
          }

          return true;
        } catch (error) {
          console.error('Error sharing post:', error);
          return false;
        }
      },

      isPostLiked: (postId: number) => {
        return get().likedPosts.has(postId);
      },

      isPostSaved: (postId: number) => {
        return get().savedPosts.has(postId);
      },

      getPostComments: (postId: number) => {
        return get().comments[postId] || [];
      },

      getLikedPosts: () => {
        const { posts, likedPosts } = get();
        return posts.filter(post => likedPosts.has(post.id));
      },

      getSavedPosts: () => {
        const { posts, savedPosts } = get();
        return posts.filter(post => savedPosts.has(post.id));
      },

      initializePosts: (posts: (Post | DummyPost)[]) => {
        set({ posts });
      },

      addPost: (post: Post | DummyPost) => {
        set((state) => ({
          posts: [post, ...state.posts],
        }));
      },

      updatePost: (postId: number, updates: Partial<Post | DummyPost>) => {
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId ? { ...post, ...updates } : post
          ),
        }));
      },
    }),
    {
      name: 'social-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        likedPosts: Array.from(state.likedPosts || []),
        savedPosts: Array.from(state.savedPosts || []),
        comments: state.comments || {},
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.likedPosts = new Set(state.likedPosts);
          state.savedPosts = new Set(state.savedPosts);
        }
      },
    }
  )
);
