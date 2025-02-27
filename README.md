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


