import type { Post, User } from "./types";

/**
 * Placeholder data for frontend development.
 * Replace these with real API calls once the backend is ready.
 */

export const currentUser: User = {
  id: "user-1",
  username: "janedoe",
  displayName: "Jane Doe",
  avatarUrl: "https://i.pravatar.cc/150?u=janedoe",
  bio: "Photographer & traveler. Capturing moments one frame at a time.",
  postsCount: 42,
  followersCount: 1_280,
  followingCount: 340,
  isFollowing: false,
};

export const users: User[] = [
  currentUser,
  {
    id: "user-2",
    username: "alexchen",
    displayName: "Alex Chen",
    avatarUrl: "https://i.pravatar.cc/150?u=alexchen",
    bio: "Coffee addict & software engineer.",
    postsCount: 87,
    followersCount: 2_450,
    followingCount: 180,
    isFollowing: true,
  },
  {
    id: "user-3",
    username: "sarahmiller",
    displayName: "Sarah Miller",
    avatarUrl: "https://i.pravatar.cc/150?u=sarahmiller",
    bio: "Digital artist. Creating worlds from pixels.",
    postsCount: 156,
    followersCount: 5_120,
    followingCount: 420,
    isFollowing: false,
  },
  {
    id: "user-4",
    username: "mikejohnson",
    displayName: "Mike Johnson",
    avatarUrl: "https://i.pravatar.cc/150?u=mikejohnson",
    bio: "Fitness enthusiast and food lover.",
    postsCount: 63,
    followersCount: 890,
    followingCount: 210,
    isFollowing: true,
  },
];

export const posts: Post[] = [
  {
    id: "post-1",
    imageUrl: "https://picsum.photos/seed/post1/600/600",
    caption: "Golden hour never disappoints. 🌅",
    author: users[1],
    likesCount: 234,
    commentsCount: 18,
    isLiked: true,
    createdAt: "2025-05-10T18:30:00Z",
  },
  {
    id: "post-2",
    imageUrl: "https://picsum.photos/seed/post2/600/600",
    caption: "New artwork finally complete — swipe to see the process!",
    author: users[2],
    likesCount: 512,
    commentsCount: 47,
    isLiked: false,
    createdAt: "2025-05-09T14:15:00Z",
  },
  {
    id: "post-3",
    imageUrl: "https://picsum.photos/seed/post3/600/600",
    caption: "Leg day is the best day. No debate.",
    author: users[3],
    likesCount: 98,
    commentsCount: 5,
    isLiked: false,
    createdAt: "2025-05-08T09:00:00Z",
  },
  {
    id: "post-4",
    imageUrl: "https://picsum.photos/seed/post4/600/600",
    caption: "Weekend vibes in the city. ☕",
    author: users[1],
    likesCount: 178,
    commentsCount: 12,
    isLiked: true,
    createdAt: "2025-05-07T11:45:00Z",
  },
  {
    id: "post-5",
    imageUrl: "https://picsum.photos/seed/post5/600/600",
    caption: "Experimenting with new color palettes for my next series.",
    author: users[2],
    likesCount: 340,
    commentsCount: 29,
    isLiked: false,
    createdAt: "2025-05-06T16:20:00Z",
  },
  {
    id: "post-6",
    imageUrl: "https://picsum.photos/seed/post6/600/600",
    caption: "Meal prep Sunday — fuel for the week ahead.",
    author: users[3],
    likesCount: 67,
    commentsCount: 3,
    isLiked: true,
    createdAt: "2025-05-05T08:30:00Z",
  },
];
