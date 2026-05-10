import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../app/baseQueryWithAuth";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    getCommentsByPostId: builder.query({
      query: (postId) => `/comment/${postId}/post`,
      providesTags: (result, error, postId) => [
        { type: "Comments", id: postId },
      ],
    }),
    getCommentById: builder.query({
      query: (commentId) => `/comment/${commentId}`,
    }),
    addComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/comment/${postId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: postId },
      ],
    }),
    updateComment: builder.mutation({
      query: ({ commentId, content }) => ({
        url: `/comment/${commentId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: (result, error, { commentId }) => ["Comments"],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetCommentsByPostIdQuery,
  useGetCommentByIdQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
