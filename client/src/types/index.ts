
export interface User {
    id: string;
    email: string;
    username: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  likes: string[];
  images?: string[];
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  post: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: {
    data: Post[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: {
    data: Comment[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}
