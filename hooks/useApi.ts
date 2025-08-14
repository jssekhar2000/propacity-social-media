import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { CreatePostData } from '@/types/api';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: apiService.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDummyUsers = () => {
  return useQuery({
    queryKey: ['dummy-users'],
    queryFn: apiService.getDummyUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => apiService.getPosts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length * 10;
    },
    initialPageParam: 0,
  });
};

export const useInfiniteDummyPosts = () => {
  return useInfiniteQuery({
    queryKey: ['dummy-posts'],
    queryFn: ({ pageParam = 0 }) => apiService.getDummyPosts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.posts.length < 10) return undefined;
      return allPages.length * 10;
    },
    initialPageParam: 0,
  });
};

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => apiService.getPost(id),
    enabled: !!id,
  });
};

export const usePostComments = (postId: number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => apiService.getPostComments(postId),
    enabled: !!postId,
  });
};

export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: ['search-posts', query],
    queryFn: () => apiService.searchPosts(query),
    enabled: query.length > 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostData) => apiService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['dummy-posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePostData> }) =>
      apiService.updatePost(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['dummy-posts'] });
    },
  });
};