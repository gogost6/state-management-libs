import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts?_limit=5",
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;
