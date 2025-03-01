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