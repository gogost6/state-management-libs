import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const catApi = createApi({
  reducerPath: "catApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getRandomCat: builder.query({
      query: () => ({
        url: "/cat/random-cat",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
        cache: "no-cache",
      }),
    }),
    getRandomCatByTag: builder.query({
      query: (tag) => ({
        url: `/cat/random-cat-by-tag/${encodeURIComponent(tag)}`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
        cache: "no-cache",
      }),
    }),
    getRandomCatGif: builder.query({
      query: () => ({
        url: "/cat/random-cat-gif",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
        cache: "no-cache",
      }),
    }),
  }),
});

export const {
  useGetRandomCatQuery,
  useGetRandomCatByTagQuery,
  useGetRandomCatGifQuery,
} = catApi;
