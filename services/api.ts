import { User, Post, Comment, CreatePostData, DummyUser, DummyPost } from '@/types/api';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const DUMMY_URL = 'https://dummyjson.com';

class ApiService {
  private async fetchWithError<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.fetchWithError<User[]>(`${BASE_URL}/users`);
  }

  async getDummyUsers(): Promise<{ users: DummyUser[] }> {
    return this.fetchWithError<{ users: DummyUser[] }>(`${DUMMY_URL}/users?limit=20`);
  }

  // Posts
  async getPosts(start = 0, limit = 10): Promise<Post[]> {
    return this.fetchWithError<Post[]>(`${BASE_URL}/posts?_start=${start}&_limit=${limit}`);
  }

  async getDummyPosts(skip = 0, limit = 10): Promise<{ posts: DummyPost[]; total: number }> {
    return this.fetchWithError<{ posts: DummyPost[]; total: number }>(`${DUMMY_URL}/posts?skip=${skip}&limit=${limit}`);
  }

  async getPost(id: number): Promise<Post> {
    return this.fetchWithError<Post>(`${BASE_URL}/posts/${id}`);
  }

  async createPost(data: CreatePostData): Promise<Post> {
    return this.fetchWithError<Post>(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: number, data: Partial<CreatePostData>): Promise<Post> {
    return this.fetchWithError<Post>(`${BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: number): Promise<void> {
    await this.fetchWithError(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments
  async getPostComments(postId: number): Promise<Comment[]> {
    return this.fetchWithError<Comment[]>(`${BASE_URL}/posts/${postId}/comments`);
  }

  // Search
  async searchPosts(query: string): Promise<{ posts: DummyPost[] }> {
    return this.fetchWithError<{ posts: DummyPost[] }>(`${DUMMY_URL}/posts/search?q=${encodeURIComponent(query)}`);
  }
}

export const apiService = new ApiService();