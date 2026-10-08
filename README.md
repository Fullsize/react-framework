# React Framework — React + TypeScript Starter

**English** | [简体中文](./README.zh-CN.md)

A React 18 and TypeScript frontend starter built with Vite, Ant Design, Tailwind CSS, and ECharts. React Framework provides a shared project structure, lazy-loaded routes, light and dark themes, and reusable UI examples for teams building single-page applications, dashboards, and internal tools.

Use it as a starting point for your own application or as a reference for organizing a React project. It is an application scaffold, with source code you can adapt directly.

## Contents

- [Features](#features)
- [Quick start](#quick-start)
- [Commands](#commands)
- [Project structure](#project-structure)
- [Add a page](#add-a-page)
- [Styling and themes](#styling-and-themes)
- [API configuration](#api-configuration)
- [Build and deployment](#build-and-deployment)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

## Features

| Area             | Included                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Application      | React 18, TypeScript 5, React Router 6                                                         |
| Development      | Vite 5, React plugin, `@` source alias                                                         |
| Routing          | Central route configuration, lazy page imports, nested routes, higher-order component wrappers |
| UI               | Ant Design 5, Tailwind CSS 3, CSS Modules, global CSS                                          |
| Themes           | React context with light/dark configuration for Ant Design and ECharts                         |
| Visualization    | ECharts 5 wrapper and chart example                                                            |
| Examples         | Theme switching, static image imports, charts, and an Editor.js editor                         |
| Requests         | Axios instance with interceptors, timeout, and pending-request handling                        |
| Code conventions | ESLint, Prettier, Husky, and lint-staged                                                       |
| Deployment       | Static Vite output, Docker multi-stage build, Nginx configuration                              |

Vite is the default build tool. Older Webpack configurations are also retained in `webpack/`; the current route loader uses Vite's `import.meta.glob`, so Webpack requires adaptation before use.

## Quick start

Use **Node.js 20** (also used by the CI and Docker configurations) and **pnpm 9** to work with the checked-in v9 lockfile.

```bash
git clone https://github.com/Fullsize/react-framework.git
cd react-framework
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is occupied, use the URL printed by Vite.

The app uses hash routing. Explore these examples directly:

| Page   | URL path    | Source                       |
| ------ | ----------- | ---------------------------- |
| Home   | `/#/`       | `src/pages/home/index.tsx`   |
| Theme  | `/#/theme`  | `src/pages/theme/index.tsx`  |
| Images | `/#/image`  | `src/pages/image/index.tsx`  |
| Charts | `/#/chart`  | `src/pages/chart/index.tsx`  |
| Editor | `/#/editor` | `src/pages/editor/index.tsx` |

## Commands

| Command                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `pnpm dev`               | Start the Vite development server                |
| `pnpm build`             | Create the production bundle in `dist/`          |
| `pnpm exec vite preview` | Preview the built app locally                    |
| `pnpm lint`              | Run ESLint on `src/` **with automatic fixes**    |
| `pnpm exec tsc --noEmit` | Run the TypeScript checker separately            |
| `pnpm dev:webpack`       | Run the legacy Webpack development configuration |
| `pnpm build:webpack`     | Run the legacy Webpack production configuration  |

`pnpm test` currently exits with a placeholder error; an automated test suite has not been configured. Vite builds and TypeScript checks are separate commands.

## Project structure

```text
react-framework/
├── src/
│   ├── index.tsx                 # React entry point and HashRouter
│   ├── components/
│   │   ├── layout/               # Theme provider and application layout
│   │   ├── route-component/      # Route rendering and lazy page loading
│   │   ├── echarts/              # Chart wrapper
│   │   └── tailwind/             # Flex layout helpers
│   ├── pages/                    # Home, theme, image, chart, editor examples
│   ├── routes/index.ts           # Route definitions
│   ├── hocs/                     # Page wrappers, including auth placeholder
│   ├── service/request.ts        # Shared Axios instance
│   ├── theme/                    # Ant Design, ECharts, and CSS themes
│   ├── images/                   # Imported image assets
│   └── utils/                    # Shared utilities
├── public/js/config.js           # Runtime API configuration
├── types/                        # Type declarations
├── webpack/                      # Legacy build configurations
├── .github/workflows/            # CI and GitHub Pages workflows
├── vite.config.mjs               # Vite plugins, alias, and server settings
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
└── nginx.conf
```

## Add a page

Create `src/pages/about/index.tsx` with a default export:

```tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
    </main>
  );
}
```

Add an entry to the array in `src/routes/index.ts`:

```ts
{
  path: 'about',
  name: 'About',
  component: 'about',
  children: [],
},
```

Visit `/#/about`. The route loader resolves `component: 'about'` to `src/pages/about/index.tsx` or `src/pages/about.tsx` and loads it with `React.lazy` and `Suspense`.

Use the optional `hoc` array for page wrappers and `children` for nested routes. A parent page needs React Router's `<Outlet />` to render its child route. The current loader resolves a component for every entry, so supply a valid `component` even for entries using `to` to redirect.

The `withAuth` wrapper currently renders its page unconditionally. Implement authentication and connect your own token source before using it to protect routes.

## Styling and themes

- Use `*.module.css` for locally scoped styles and regular `*.css` for global styles.
- Use Tailwind utility classes in JSX; flex helpers live in `src/components/tailwind/`.
- Import application code with `@/`, which maps to `src/` in Vite and TypeScript.
- Keep shared CSS theme rules in `src/theme/css/index.css`.

`src/components/layout/index.tsx` owns the theme state and passes it through `ThemeContext` and Ant Design's `ConfigProvider`. The default is `light`; both Ant Design token configurations and ECharts themes are defined under `src/theme/`.

To switch themes inside a component:

```tsx
import { useContext } from 'react';
import ThemeContext from '@/theme';

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch theme
    </button>
  );
}
```

## API configuration

`index.html` loads `public/js/config.js` before the application. Set your API endpoint there:

```js
window.baseapi = 'https://api.example.com';
```

`src/service/request.ts` reads this value when creating its Axios instance. The checked-in value, `'123'`, is a placeholder. Update the token handling and response/error conventions for your backend before connecting real services. Values in this public file are visible to browsers; keep credentials on the server.

## Build and deployment

```bash
pnpm build
pnpm exec vite preview
```

Serve the generated `dist/` directory from a static host. Vite uses `base: './'` for relative asset paths, and hash routing keeps page navigation in the URL fragment. The preview command is for local verification.

For a container build with Docker and BuildKit support:

```bash
docker build -t react-framework .
docker run --rm -p 8080:80 react-framework
```

Open [http://localhost:8080](http://localhost:8080). The Dockerfile builds with Node.js 20 and serves `dist/` through Nginx. Its dependency installation uses the npmmirror registry.

The repository also includes a GitHub Pages workflow targeting `master`. Configure Pages to use GitHub Actions in your fork if you want to use it; inspect the workflow and repository settings before publishing.

## Contributing

[Open an issue](https://github.com/Fullsize/react-framework/issues) for bugs or ideas, or submit a focused pull request with a description of the change and how you verified it.

Use commit messages such as:

```text
feat: add a settings page
fix: correct chart theme switching
docs: update setup instructions
```

Other useful prefixes are `style`, `refactor`, `test`, and `chore`. The pre-commit hook runs lint-staged, which can format and fix files automatically. These commit prefixes are a convention, not an enforced commit-message check.

## FAQ

**Is this a React framework package?**

It is a starter repository for a React single-page application. Clone it and adapt the source to your project.

**Does it include server-side rendering?**

The current entry point renders in the browser with `createRoot` and `HashRouter`. SSR and static page generation are not configured.

**Can I use npm instead of pnpm?**

Yes: use `npm install`, `npm run dev`, and `npm run build`. pnpm is recommended because the repository tracks `pnpm-lock.yaml`.

**Does the editor save to a backend?**

The example logs Editor.js output to the browser console. Persistence and image upload endpoints need your own integration.

## License

`package.json` declares **ISC**. A standalone license file is not currently included in the repository.
