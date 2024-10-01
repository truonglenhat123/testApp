import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

interface Post {
  id: string;
  title: string;
  selftext: string;
  url: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  more: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  more: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({more}: {more: string | null}) => {
    const url = 'https://www.reddit.com/r/reactnative.json';

    const response = await axios.get(url, {
      params: {
        after: more || undefined,
      },
    });
    console.log('data return', response);
    const posts = response.data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      selftext: child.data.selftext,
      url: child.data.url,
    }));

    return {
      posts: posts.slice(0, 20),
      after: response.data.data.after,
    };
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.posts.length > 0) {
          state.posts = [...state.posts, ...action.payload.posts];
        }
        state.more = action.payload.after;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default postsSlice.reducer;
