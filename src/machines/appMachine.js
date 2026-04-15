import { assign, createMachine, fromPromise } from "xstate";

export const appMachine = createMachine(
  {
    id: "app",
    initial: "loading",
    context: {
      count: 0,
      posts: [],
      error: "",
    },
    states: {
      loading: {
        invoke: {
          src: "fetchPosts",
          onDone: {
            target: "ready",
            actions: assign({
              posts: ({ event }) => event.output,
              error: () => "",
            }),
          },
          onError: {
            target: "failure",
            actions: assign({
              error: ({ event }) =>
                event.error?.message || "Failed to fetch posts",
            }),
          },
        },
        on: {
          INCREMENT: {
            actions: assign({
              count: ({ context }) => context.count + 1,
            }),
          },
          DECREMENT: {
            actions: assign({
              count: ({ context }) => context.count - 1,
            }),
          },
          RESET: {
            actions: assign({
              count: () => 0,
            }),
          },
        },
      },

      ready: {
        on: {
          INCREMENT: {
            actions: assign({
              count: ({ context }) => context.count + 1,
            }),
          },
          DECREMENT: {
            actions: assign({
              count: ({ context }) => context.count - 1,
            }),
          },
          RESET: {
            actions: assign({
              count: () => 0,
            }),
          },
          REFETCH: {
            target: "loading",
            actions: assign({
              error: () => "",
            }),
          },
        },
      },

      failure: {
        on: {
          INCREMENT: {
            actions: assign({
              count: ({ context }) => context.count + 1,
            }),
          },
          DECREMENT: {
            actions: assign({
              count: ({ context }) => context.count - 1,
            }),
          },
          RESET: {
            actions: assign({
              count: () => 0,
            }),
          },
          REFETCH: {
            target: "loading",
            actions: assign({
              error: () => "",
            }),
          },
        },
      },
    },
  },
  {
    actors: {
      fetchPosts: fromPromise(async () => {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=5",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        return response.json();
      }),
    },
  },
);
