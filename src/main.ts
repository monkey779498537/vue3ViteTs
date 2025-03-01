import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App) // 创建vue实例
  .use(ElementPlus)
  .mount('#app') // 渲染到根节点
