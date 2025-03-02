import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

// 创建 Pinia 实例
const pinia = createPinia()

createApp(App) // 创建vue实例
  .use(ElementPlus)
  .use(pinia)
  .mount('#app') // 渲染到根节点
