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