import { create } from "zustand";
import axios from 'axios'

interface UserState {
  user: { email: string; fullName: string } | null;
  setUser: (user: { email: string; fullName: string } | null) => void;
}

interface Post {
  id: number;
  title: string;
  body: string;
  image: string; 
}

interface PostState {
  posts: Post[] | null;
  setPosts: (posts: Post[] | null) => void;
  fetchPosts: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));

export const usePostStore = create<PostState>((set) => ({
  posts: null,
  setPosts: (posts) => set({ posts }),
  fetchPosts: async () => {
    try {

      const response = await axios.get(import.meta.env.VITE_FIREBASE_FETCH_IMAGE_AND_TEXTS);

      const postsWithImages = response.data;

      set({ posts: postsWithImages });
    } catch (error) {
      console.error("Error fetching posts data:", error);
    }
  },
}));