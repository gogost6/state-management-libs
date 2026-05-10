import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../app/baseQueryWithAuth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    updateEmail: builder.mutation({
      query: (newEmail) => ({
        url: `/auth/email?newEmail=${encodeURIComponent(newEmail)}`,
        method: "PUT",
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: `/auth/password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`,
        method: "PUT",
      }),
    }),
    addRoleToUser: builder.mutation({
      query: ({ email, role }) => ({
        url: `/auth/users/${encodeURIComponent(email)}/roles/${role}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useAddRoleToUserMutation,
} = authApi;
