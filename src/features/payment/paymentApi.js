import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../app/baseQueryWithAuth";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CalendarStatus"],
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: () => ({
        url: "/payments/checkout",
        method: "POST",
        body: { returnUrl: window.location.href },
      }),
    }),
    getCalendarStatus: builder.query({
      query: () => "/payments/calendar/status",
      providesTags: ["CalendarStatus"],
    }),
    downloadCalendar: builder.mutation({
      query: () => ({
        url: "/payments/calendar/download",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "cat-calendar.pdf";
          a.click();
          URL.revokeObjectURL(url);
          return { downloaded: true };
        },
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetCalendarStatusQuery,
  useDownloadCalendarMutation,
} = paymentApi;
