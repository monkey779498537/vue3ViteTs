#### 创建vite脚手架

```js
npm create vite@latest .
// 注意最后的 `.` 表示当前目录 这样在git仓库提交的时候就不会多处一层目录
```

#### 初始化
```js
npm i
```
- 安装node_modules依赖
- 自动生成 package-lock.json 文件
    - 区别
        - package.json是定义项目依赖和版本范围
        - package-lock.json则是锁定具体版本，确保安装的一致性。
    - 作用
        - `依赖版本锁定`: 是 npm 自动生成的文件，精确记录当前项目中所有依赖包及其子依赖的版本号。
        - `安装一致性`: 确保团队成员、CI/CD 环境、生产服务器安装依赖时，完全复现相同的依赖树，避免因版本差异导致的不可预测问题。
    - 是否应该提交git
        - 应该提交
            - 团队协作
                - 如果多人协作开发，package-lock.json 保证所有人安装完全一致的依赖版本，避免因依赖版本差异导致的 Bug
            - 生产环境部署
                - 部署时依赖版本必须固定，防止新版本的依赖引入破坏性变更（例如某个包发布了不兼容的更新）
            - CI/CD 流程
                - 持续集成工具（如 GitHub Actions、Jenkins）需要依赖 package-lock.json 安装确定性的依赖树
            - npm 官方推荐
                - npm 官方文档明确指出：应该将 package-lock.json 提交到版本控制
        - 不提交的情况
            - 仅开发库

#### 安装核心依赖
```js
npm install vue-router@4 pinia axios
npm install element-plus @element-plus/icons-vue
npm install eslint prettier eslint-plugin-vue -D
```
- 项目的搭建核心 vue3 + vite + TS + vue-router + pinia + axios + ElementPlus

#### 代码风格规范
- ESLint + Prettier：代码风格检查
    - @eslint/js
        - 封装了 ESLint 内置的所有核心 JavaScript 规则
    - vue-eslint-parser
        - 将 Vue 单文件组件（.vue 文件）解析为抽象语法树（AST），使 ESLint 可以对整个 Vue 组件进行分析
    - eslint-plugin-vue
        - 提供针对 Vue 单文件组件（.vue）的代码`规范检查`
    - eslint-plugin-prettier
        - 结合 ESLint 和 Prettier 进行代码检查和格式化，确保代码风格的一致性
    - @typescript-eslint/parser
        - 用于 ESLint 的 TypeScript 解析器，ESLint 默认只能解析 JavaScript 代码
    - @typescript-eslint/eslint-plugin
        - 为 TypeScript 代码提供特定 ESLint 规则的插件
    - globals
        - 提供了一个预定义的全局变量列表，配置 ESLint 时，需要告知 ESLint 项目中使用的全局变量
    ```js
    npm install -D @eslint/js vue-eslint-parser eslint-plugin-vue eslint-plugin-prettier
    npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
    npm install -D globals
    ```
    - 配置文件
        - 需要注意，如果安装的是eslint9+版本，不能使用.eslintrc.cjs进行配置，必须改成eslint.config.js，否则lint的时候报错
            - 处理以上版本问题，要么降低版本保留原配置.eslintrc.cjs，要么迁移eslint.config.js
    - ESLint 主要检测
        - 未使用变量 unusedVar
        - 箭头函数空格问题
        - 代码缩进不一致
        - 模板中双引号使用问题
        - 语句缺少分号（根据 Prettier 配置）
    - 需要新增文件和配置
        - eslint.config.js 核心文件
        - tsconfig.eslint.json
        - .prettierrc
        - .eslintignore
        - package.json 新增lint配置
        ```js
        "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
        "format": "prettier --write ."
        ```
    - 测试配置效果
        - 在src下的任意vue文件的script标签中插入以下代码，后再运行npm run lint
        ```js
        // 这里有多个需要 lint 的错误 eslint 检测测试代码
        const unusedVar = 'test'  // 未使用的变量
        const  testFunc = ()=>{  // 箭头函数空格问题
        console.log('hello')      // 缩进问题
        }
        ```
        - 得到的反馈应该是这个文件的报错，并且会自动把缩紧格式化处理
    
- 开发阶段实时检查 TypeScript 错误
    - 插件名称 vite-plugin-checker
        在npm run dev的时候就直接检测TS型类进行报错，不用等到build的时候才报错
    - 原因：
        - Vite默认使用esbuild来转换TypeScript，但这只是在编译时进行转译，并不会进行类型检查。
        - 默认情况下，Vite在开发服务器（dev）运行时，并不会执行TypeScript的类型检查
        - build时可能会使用tsc来进行类型检查
    ```js
    // 安装插件
    npm install vite-plugin-checker --save-dev

    // vite.config.ts 配置插件
    import checker from 'vite-plugin-checker'
    
    export default defineConfig({
      plugins: [
        ...
        checker({
          // 如果是配置 tsconfig.app.json 需要手动指定
          // 显式启用 Vue 类型检查
          vueTsc: {
              tsconfigPath: "./tsconfig.app.json", // 显式指定配置
          },
        }),
      ],
    })

    // tsconfig.app.json
    {
      "compilerOptions": {
          "strict": true,
      },
      "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
    }
    ```

- Husky(Git Hooks管理) + lint-staged(Git 仅检查暂存区文件)：Git 提交校验
```js
// 安装
npm install husky lint-staged -D

// 初始化 husky
npx husky install // 会自动创建 .husky文件用来配置git钩子内容
npm pkg set scripts.prepare="husky install"

// package.json 新增
{
    "lint-staged": {
        "*.{js,ts,vue}": [
            "eslint --fix --max-warnings 0"
        ]
    }
}

// 在.husky 手动新增pre-commit文件
npx lint-staged // 表示在git commit动作的时候进行操作 相当于 npm run lint:lint-staged

// 测试
git commit -m 'test husky' // 按照eslint规则报错
```
```js
// 实现 Git 提交时仅拦截错误（error）而放过警告（warning）
// husky 创建自定义过滤脚本
touch .husky/allow-warnings.js

// .husky/allow-warnings.js
/* global process */
import { execSync } from 'child_process'

try {
  // 执行 ESLint 检测但允许无限数量的警告
  execSync('eslint --fix --max-warnings=1000000', { stdio: 'inherit' })
} catch (e) {
  // 当有 error 类型规则被触发时，才会退出并阻止提交
  process.exit(e.status)
}

// 修改.husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

- npx lint-staged
+ node .husky/allow-warnings.js
```

#### 设计目录结构
```js
src/
├─ api/          // 接口封装
├─ assets/       // 静态资源
├─ components/   // 公共组件
├─ router/       // 路由配置
├─ stores/       // Pinia store
├─ views/        // 页面组件
├─ utils/        // 工具函数
├─ types/        // TS类型定义 如果是vue3 并使用TS时
└─ App.vue
main.ts
```

#### 配置路径别名：@
- vue3已经支持路径别名，无需额外安装

```js
// 修改文件 vite.config
import path from 'path' // 新增

export default defineConfig({
    ...
    // 新增
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})
```
- 引入path模块时的type依赖，否则在编译打包时，TS检测识别不了path相关内容
- 当你需要 import path from 'path' 时需要处理
- 原因
    - 通常是因为path是 Node.js 内置模块，而 Vite 默认运行在浏览器环境中，TypeScript 可能无法识别path模块的类型
```js
npm install --save-dev @types/node
```

- 额外注意：
1. 配置了TS模块，需要对TS也做别名配置，vite.config.ts 不对TS生效
2. 当有tsconfig.app.json 和 tsconfig.json文件时，需要设置到 tsconfig.app.json文件中
```js
// tsconfig.app.json
{
  compilerOptions: {
    // 核心代码
    "baseUrl": ".",  // 设置根目录为基准路径，所有路径解析的起点
    "paths": {       // 定义路径映射规则
      "@/*": [       // 当检测到以 @/ 开头的路径时
        "./src/*"    // 映射到项目根目录下的 src 目录
      ]
    }
  }
}
```

#### 挂载组件
- `src/main.ts`: 安装好的组件需要挂载到vue实例上进行使用

```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App) // 创建vue实例
    .use(ElementPlus)
    .mount('#app') // 渲染到根节点
```

#### 配置代理
- 使用网上的公开免费api做测试练手
- 登录认证接口
    - 推荐使用 Reqres.in（专门用于测试的伪服务端）：
    - 登录接口：POST https://reqres.in/api/login
    - 请求参数：{ "email": "eve.holt@reqres.in", "password": "cityslicka" }
    - 返回 token：{ "token": "QpwL5tke4Pnpja7X4" }
- 增删改查接口
    - 推荐使用 JSONPlaceholder（经典伪 REST API）：
    - 获取列表：GET https://jsonplaceholder.typicode.com/posts
    - 新增数据：POST https://jsonplaceholder.typicode.com/posts
    - 修改数据：PUT https://jsonplaceholder.typicode.com/posts/1
    - 删除数据：DELETE https://jsonplaceholder.typicode.com/posts/1

```js
// 修改文件 vite.config
import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'https://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            },
            '/reqres': {
                target: 'https://reqres.in/api',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/reqres/, '')
            }
        }
    }
})
```

#### 环境量配置
- 根目录下创建以下文件
    - .env             # 所有情况下都会加载，通常用于存储默认值或者跨环境的共享变量，可选配置
    - .env.local       # 所有情况下都会加载，但会被 git 忽略
    - .env.development # 开发环境
    - .env.production  # 生产环境
- 注意事项：
    1. 只有以 VITE_ 开头的变量才会被暴露给客户端
    2. 敏感信息（如数据库密码）不应该放在前端环境变量中
    3. 环境变量在构建时会被替换，修改环境变量需要重新构建
    4. 可以使用 .env.local 文件来覆盖默认配置（该文件会被 git 忽略）
```js
// .env 可选
VITE_APP_NAME = MyAwesomeApp
VITE_COMPANY_LOGO_URL = /logo.png

// .env.local 可选
VITE_API_KEY = your_secret_key_here

// .env.development
VITE_API_BASE_URL = http://localhost:3000/api
VITE_APP_TITLE = My App (Dev)

// .env.production
VITE_API_BASE_URL = https://api.example.com
VITE_APP_TITLE = My App
```

#### Axios封装
- 创建 utils/request.ts 文件用于封装axios
- 创建 types/request.ts 文件用于定义axios封装里面的type

#### 封装API请求
- src/api/auth.ts
- src/types/auth.ts 根据接口返回，定义TS接口类型
- src/api/post.ts
- src/types/post.ts 根据接口返回，定义TS接口类型
- src/api/index.ts 统一暴露出去给业务方使用，以便统一管理

#### 全局状态管理 Pinia
- 新增 src/stores/user.ts 作为全局状态管理用户登陆token信息

#### 路由配置

#### 业务代码