/** Core domain types for the Social App frontend. */

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: Pick<User, "id" | "username" | "avatarUrl">;
  createdAt: string;
}
