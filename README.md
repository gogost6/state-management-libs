# State Management Libraries — React + Vite

A demo React app showcasing different state management solutions. Each library lives on its own branch so you can compare implementations side by side.

## Branches

| Branch                      | Library                   |
| --------------------------- | ------------------------- |
| `main`                      | Redux Toolkit + RTK Query |
| `with-zustand`              | Zustand                   |
| `with-tanstack-react-query` | TanStack React Query      |
| `with-recoil-atom`          | Recoil                    |
| `with-jotai`                | Jotai                     |
| `with-mobx`                 | MobX                      |
| `with-valtio`               | Valtio                    |
| `with-xstate`               | XState                    |

## Live Demo

The app is deployed at **[vps.moqtasvatba.online](http://vps.moqtasvatba.online)**. using
a Virtual Private Server, Docker and nginx!

The `VITE_PUBLIC_API_URL` is a Java Spring Boot application which is also hosted on the VPS
using the **[vpsapi.moqtasvatba.online](http://vpsapi.moqtasvatba.online)**

## Local Development

```bash
npm install
npm run dev
```

Create a `.env` file in the project root:

```env
VITE_PUBLIC_API_URL=http://localhost:8080/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Default stuff

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
