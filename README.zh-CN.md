# React Framework — React + TypeScript 前端脚手架

[English](./README.md) | **简体中文**

React Framework 是基于 React 18、TypeScript 和 Vite 的前端项目脚手架，集成 Ant Design、Tailwind CSS 和 ECharts。项目提供统一的目录结构、路由懒加载、明暗主题和可复用的页面示例，适合作为单页应用、管理后台、数据看板和内部工具的起点。

你可以直接克隆并修改源码，也可以参考其中的 React 项目组织方式，建立团队自己的开发规范。

## 目录

- [功能与技术栈](#功能与技术栈)
- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [项目结构](#项目结构)
- [新增页面](#新增页面)
- [样式与主题](#样式与主题)
- [API 配置](#api-配置)
- [构建与部署](#构建与部署)
- [参与贡献](#参与贡献)
- [常见问题](#常见问题)
- [许可证](#许可证)

## 功能与技术栈

| 领域       | 已包含的能力                                                |
| ---------- | ----------------------------------------------------------- |
| 应用基础   | React 18、TypeScript 5、React Router 6                      |
| 开发工具   | Vite 5、React 插件、`@` 源码路径别名                        |
| 路由       | 集中配置、页面懒加载、嵌套路由、高阶组件包装                |
| 界面与样式 | Ant Design 5、Tailwind CSS 3、CSS Modules、全局 CSS         |
| 主题       | React Context 管理明暗主题，包含 Ant Design 和 ECharts 配置 |
| 数据可视化 | ECharts 5 组件封装与图表示例                                |
| 页面示例   | 主题切换、静态图片导入、图表、Editor.js 编辑器              |
| 网络请求   | Axios 实例、拦截器、超时设置和待处理请求管理                |
| 代码规范   | ESLint、Prettier、Husky、lint-staged                        |
| 部署       | Vite 静态产物、Docker 多阶段构建、Nginx 配置                |

默认开发和构建工具为 Vite。`webpack/` 保留了旧版配置，但当前路由加载器依赖 Vite 的 `import.meta.glob`，使用 Webpack 前需要做兼容调整。

## 快速开始

建议使用 **Node.js 20**（与 CI、Docker 配置一致）和 **pnpm 9**（对应仓库中的 v9 锁文件）。

```bash
git clone https://github.com/Fullsize/react-framework.git
cd react-framework
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。如果端口被占用，以 Vite 终端输出的地址为准。

项目使用 HashRouter，可以直接访问以下示例：

| 页面     | URL 路径    | 源码                         |
| -------- | ----------- | ---------------------------- |
| 首页     | `/#/`       | `src/pages/home/index.tsx`   |
| 主题     | `/#/theme`  | `src/pages/theme/index.tsx`  |
| 静态图片 | `/#/image`  | `src/pages/image/index.tsx`  |
| 图表     | `/#/chart`  | `src/pages/chart/index.tsx`  |
| 编辑器   | `/#/editor` | `src/pages/editor/index.tsx` |

## 常用命令

| 命令                     | 用途                              |
| ------------------------ | --------------------------------- |
| `pnpm dev`               | 启动 Vite 开发服务器              |
| `pnpm build`             | 构建生产资源，输出至 `dist/`      |
| `pnpm exec vite preview` | 本地预览构建产物                  |
| `pnpm lint`              | 检查 `src/`，**同时自动修复代码** |
| `pnpm exec tsc --noEmit` | 单独执行 TypeScript 类型检查      |
| `pnpm dev:webpack`       | 运行旧版 Webpack 开发配置         |
| `pnpm build:webpack`     | 运行旧版 Webpack 生产配置         |

目前没有配置自动化测试套件，`pnpm test` 会输出占位错误并退出。Vite 构建与 TypeScript 类型检查需要分别执行。

## 项目结构

```text
react-framework/
├── src/
│   ├── index.tsx                 # React 入口与 HashRouter
│   ├── components/
│   │   ├── layout/               # 主题 Provider 与应用布局
│   │   ├── route-component/      # 路由渲染与页面懒加载
│   │   ├── echarts/              # 图表组件
│   │   └── tailwind/             # Flex 布局辅助组件
│   ├── pages/                    # 首页、主题、图片、图表、编辑器示例
│   ├── routes/index.ts           # 路由定义
│   ├── hocs/                     # 页面包装器，包含鉴权占位实现
│   ├── service/request.ts        # 共用 Axios 实例
│   ├── theme/                    # Ant Design、ECharts 与 CSS 主题
│   ├── images/                   # 导入使用的图片资源
│   └── utils/                    # 通用工具函数
├── public/js/config.js           # 运行时 API 配置
├── types/                        # 类型声明
├── webpack/                      # 旧版构建配置
├── .github/workflows/            # CI 与 GitHub Pages 工作流
├── vite.config.mjs               # Vite 插件、路径别名与开发服务器配置
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
└── nginx.conf
```

## 新增页面

创建 `src/pages/about/index.tsx`，提供默认导出：

```tsx
export default function AboutPage() {
  return (
    <main>
      <h1>关于我们</h1>
    </main>
  );
}
```

在 `src/routes/index.ts` 的数组中添加：

```ts
{
  path: 'about',
  name: '关于我们',
  component: 'about',
  children: [],
},
```

访问 `/#/about`。路由加载器会将 `component: 'about'` 匹配到 `src/pages/about/index.tsx` 或 `src/pages/about.tsx`，通过 `React.lazy` 和 `Suspense` 加载。

可通过 `hoc` 数组添加页面包装器，通过 `children` 配置嵌套路由。父页面需要使用 React Router 的 `<Outlet />` 展示子路由。当前加载器会为每条配置解析组件，因此即使使用 `to` 重定向，也需要提供有效的 `component`。

`withAuth` 目前直接渲染页面，尚未启用登录校验。使用它保护路由前，需要接入自己的鉴权逻辑和 token 来源。

## 样式与主题

- `*.module.css` 用于局部作用域样式，普通 `*.css` 用于全局样式。
- JSX 中可以使用 Tailwind 工具类；Flex 辅助组件位于 `src/components/tailwind/`。
- 使用 `@/` 导入源码，Vite 与 TypeScript 都将其映射到 `src/`。
- 共用的 CSS 主题规则位于 `src/theme/css/index.css`。

`src/components/layout/index.tsx` 管理主题状态，通过 `ThemeContext` 和 Ant Design 的 `ConfigProvider` 向下传递。默认主题为 `light`，Ant Design token 与 ECharts 主题配置位于 `src/theme/`。

在组件中切换主题：

```tsx
import { useContext } from 'react';
import ThemeContext from '@/theme';

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      切换主题
    </button>
  );
}
```

## API 配置

`index.html` 会在应用启动前加载 `public/js/config.js`。在该文件中设置接口地址：

```js
window.baseapi = 'https://api.example.com';
```

`src/service/request.ts` 创建 Axios 实例时读取该值。仓库当前的 `'123'` 是占位值。接入实际服务前，需要按后端约定完善 token、响应处理和错误处理。这个公开文件的内容可被浏览器读取，密钥应保留在服务端。

## 构建与部署

```bash
pnpm build
pnpm exec vite preview
```

将生成的 `dist/` 目录部署到静态托管服务。Vite 配置使用 `base: './'` 生成相对资源路径，HashRouter 使用 URL 中的 hash 部分进行页面导航。preview 命令用于本地验证。

使用支持 BuildKit 的 Docker 构建容器：

```bash
docker build -t react-framework .
docker run --rm -p 8080:80 react-framework
```

打开 [http://localhost:8080](http://localhost:8080)。Dockerfile 使用 Node.js 20 构建，再通过 Nginx 提供 `dist/` 静态资源；安装依赖时使用 npmmirror 镜像源。

仓库还包含面向 `master` 分支的 GitHub Pages 工作流。如果希望在自己的 fork 中使用，请将 Pages 发布来源设置为 GitHub Actions，并在发布前检查工作流与仓库配置。

## 参与贡献

欢迎通过 [Issues](https://github.com/Fullsize/react-framework/issues) 提交问题或建议，也可以提交范围明确的 Pull Request，说明改动内容与验证方式。

建议使用以下提交格式：

```text
feat: add a settings page
fix: correct chart theme switching
docs: update setup instructions
```

其他常用前缀包括 `style`、`refactor`、`test`、`chore`。pre-commit hook 会运行 lint-staged，可能自动格式化和修复文件。提交前缀属于团队约定，目前没有提交消息检查器强制执行。

## 常见问题

**这是一个需要安装的 React 框架包吗？**

这是 React 单页应用的项目模板，可以克隆仓库后直接修改源码。

**支持服务端渲染吗？**

当前通过 `createRoot` 和 `HashRouter` 在浏览器渲染，没有配置 SSR 或静态页面生成。

**可以使用 npm 吗？**

可以，使用 `npm install`、`npm run dev` 和 `npm run build`。仓库维护的是 `pnpm-lock.yaml`，因此优先推荐 pnpm。

**编辑器会把内容保存到后端吗？**

当前示例将 Editor.js 数据输出到浏览器控制台。内容持久化与图片上传接口需要自行接入。

## 许可证

`package.json` 声明的许可证为 **ISC**，仓库目前没有单独的许可证文件。
