import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../app/baseQueryWithAuth";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CurrentUser"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["CurrentUser"],
    }),
    deleteMe: builder.mutation({
      query: () => ({ url: "/users/me", method: "DELETE" }),
      invalidatesTags: ["CurrentUser"],
    }),
    getUserByEmail: builder.query({
      query: (email) => `/users/${encodeURIComponent(email)}`,
    }),
  }),
});

export const { useGetMeQuery, useDeleteMeMutation, useGetUserByEmailQuery } =
  usersApi;
